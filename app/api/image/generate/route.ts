import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/server";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/utils/supabase/service-role";
import { putObjectPublic } from "@/lib/storage/r2";

const STYLE_HINTS: Record<string, string> = {
  portrait: 'cinematic portrait, shallow depth of field, natural light',
  illustration: 'clean vector illustration, flat colors, minimal shading',
  render3d: 'octane render, soft light, realistic materials',
  anime: 'anime style, vibrant colors, dynamic lines',
  cyberpunk: 'neon lights, rainy streets, high contrast, futuristic city',
  vintage: '35mm film, grain, warm tones, soft focus',
};

const DEFAULT_MODEL = process.env.DEFAULT_IMAGE_MODEL || 'google/gemini-2.5-flash-image';
const FALLBACK_MODEL = process.env.FALLBACK_IMAGE_MODEL || 'black-forest-labs/FLUX.1-schnell';

async function generateOne(client: OpenAI, model: string, prompt: string) {
  const gen = await client.images.generate({
    model,
    prompt,
    size: '1024x1024',
  } as any);
  const b64 = (gen as any)?.data?.[0]?.b64_json;
  if (!b64) throw new Error('Image generation failed');
  return b64;
}

export async function POST(req: Request) {
  try {
    const ok = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    if (!ok) {
      return NextResponse.json({ error: 'No image API configured. Set OPENROUTER_API_KEY.' }, { status: 501 });
    }

    const body = await req.json();
    const prompt = (body?.prompt as string || '').trim();
    const style = (body?.style as string) || 'portrait';
    const count = Math.max(1, Math.min(4, Number(body?.count || 1)));
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    if (isSupabaseConfigured) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
      const { data: customer } = await supabase.from('customers').select('id, credits').eq('user_id', user.id).single();
      if (!customer) return NextResponse.json({ error: 'No credits account found.' }, { status: 403 });
      if ((customer.credits || 0) < count) return NextResponse.json({ error: 'Insufficient credits.' }, { status: 403 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY!;
    const client = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'BananaImage',
      },
    });

    const hint = STYLE_HINTS[style] || '';
    const finalPrompt = hint ? `${prompt}, ${hint}` : prompt;

    // 1) Generate b64 images
    const b64s: string[] = [];
    let model = DEFAULT_MODEL;
    try {
      for (let i = 0; i < count; i++) {
        b64s.push(await generateOne(client, model, finalPrompt));
      }
    } catch {
      // Fallback once with another model
      b64s.length = 0;
      model = FALLBACK_MODEL;
      for (let i = 0; i < count; i++) {
        b64s.push(await generateOne(client, model, finalPrompt));
      }
    }

    // 2) Upload to R2 if configured; otherwise return data URLs
    const r2Enabled = !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET);
    let outUrls: string[] = [];
    if (r2Enabled) {
      try {
        const supabaseTmp = await createClient();
        const { data: { user: uTmp } } = await supabaseTmp.auth.getUser();
        const baseKey = `gen/${uTmp?.id || 'anon'}/${Date.now()}`;
        for (let i = 0; i < b64s.length; i++) {
          const buf = Buffer.from(b64s[i], 'base64');
          const key = `${baseKey}_${i}.png`;
          const u = await putObjectPublic(key, buf, 'image/png');
          outUrls.push(u);
        }
      } catch (e) {
        console.error('R2 upload failed', e);
        outUrls = b64s.map(b64 => `data:image/png;base64,${b64}`);
      }
    } else {
      outUrls = b64s.map(b64 => `data:image/png;base64,${b64}`);
    }

    // 3) Deduct credits after successful generation and log metadata
    try {
      if (isSupabaseConfigured && isServiceRoleConfigured) {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) {
          const admin = createServiceRoleClient();
          const { data: customer } = await admin.from('customers').select('id, credits').eq('user_id', user.id).single();
          if (customer && (customer.credits ?? 0) >= count) {
            const newCredits = (customer.credits || 0) - count;
            await admin.from('customers').update({ credits: newCredits, updated_at: new Date().toISOString() }).eq('id', customer.id);
            await admin.from('credits_history').insert({
              customer_id: customer.id,
              amount: count,
              type: 'subtract',
              description: 'image_generation',
              metadata: { prompt, style, count, images: outUrls, public: false }
            });
          }
        }
      }
    } catch (e) {
      console.error('credit deduction error', e);
    }

    return NextResponse.json({ urls: outUrls });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/server";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/utils/supabase/service-role";

export async function POST(req: Request) {
  try {
    const ok = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.STABILITY_API_KEY;
    if (!ok) {
      return NextResponse.json(
        {
          error: "No image API configured. Set your provider keys via Vercel env (e.g. OPENAI_API_KEY / OPENROUTER_API_KEY).",
        },
        { status: 501 }
      );
    }

    // Optional host enforcement (set ENFORCE_HOST=1 to enable)
    try {
      if (process.env.ENFORCE_HOST === "1" && process.env.NEXT_PUBLIC_SITE_URL) {
        const allowed = new URL(process.env.NEXT_PUBLIC_SITE_URL).host;
        const host = new URL(req.url).host;
        if (host !== allowed) {
          return NextResponse.json({ error: "Forbidden host" }, { status: 403 });
        }
        const ref = req.headers.get("referer");
        if (ref) {
          try {
            const rh = new URL(ref).host;
            if (rh !== allowed) {
              return NextResponse.json({ error: "Invalid referer" }, { status: 403 });
            }
          } catch {}
        }
      }
    } catch {}

    // Parse input
    const form = await req.formData();
    const prompt = (form.get("prompt") as string) || "A simple abstract image";

    // Require auth and credit before calling provider
    if (isSupabaseConfigured) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Basic IP rate limit for unauthenticated attempts (best-effort)
        try {
          const forwarded = req.headers.get('x-forwarded-for');
          const realIp = req.headers.get('x-real-ip');
          const clientIp = (forwarded ? forwarded.split(',')[0].trim() : realIp) || '127.0.0.1';
          await supabase.rpc('check_ip_rate_limit', { client_ip: clientIp });
        } catch {}
        return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
      }

      // Verify user credits >= 1 before provider call
      const { data: customer, error: fetchError } = await supabase
        .from('customers')
        .select('id, credits')
        .eq('user_id', user.id)
        .single();

      if (fetchError || !customer) {
        return NextResponse.json({ error: 'No credits account found. Please open dashboard first.' }, { status: 403 });
      }
      if ((customer.credits || 0) < 1) {
        return NextResponse.json({ error: 'Insufficient credits. Please purchase more credits.' }, { status: 403 });
      }
    }

    // Generate a single 512x512 image through OpenRouter
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    const client = new OpenAI({
      apiKey: apiKey!,
      baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "BananaImage",
      },
    });

    const gen = await client.images.generate({
      model: "openai/gpt-image-1",
      prompt,
      size: "512x512",
    });
    const b64 = (gen as any)?.data?.[0]?.b64_json;
    if (!b64) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 502 });
    }

    // Deduct one credit after successful generation
    try {
      if (isSupabaseConfigured && isServiceRoleConfigured) {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) {
          const admin = createServiceRoleClient();
          const { data: customer } = await admin
            .from('customers')
            .select('id, credits')
            .eq('user_id', user.id)
            .single();
          if (customer && (customer.credits ?? 0) > 0) {
            const newCredits = (customer.credits || 0) - 1;
            await admin
              .from('customers')
              .update({ credits: newCredits, updated_at: new Date().toISOString() })
              .eq('id', customer.id);
            await admin.from('credits_history').insert({
              customer_id: customer.id,
              amount: 1,
              type: 'subtract',
              description: 'image_generation',
            });
          }
        }
      }
    } catch (e) {
      console.error('credit deduction error', e);
    }

    return NextResponse.json({ url: `data:image/png;base64,${b64}` });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}


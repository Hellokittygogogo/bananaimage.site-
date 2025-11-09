import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/utils/supabase/service-role";

export async function POST(req: Request) {
  try {
    const token = process.env.CLEANUP_TOKEN || '';
    const hdr = req.headers.get('authorization') || '';
    if (!token || hdr !== `Bearer ${token}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const admin = createServiceRoleClient();
    const cutoff = new Date(Date.now() - 30*24*60*60*1000).toISOString();
    const { error } = await admin
      .from('credits_history')
      .delete()
      .eq('description', 'image_generation')
      .lt('created_at', cutoff);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 });
  }
}

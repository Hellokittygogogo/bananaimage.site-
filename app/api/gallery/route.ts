import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/utils/supabase/service-role";

export async function GET() {
  try {
    const admin = createServiceRoleClient();
    const since = new Date(Date.now() - 30*24*60*60*1000).toISOString();
    const { data, error } = await admin
      .from('credits_history')
      .select('id, created_at, metadata')
      .eq('type', 'subtract')
      .eq('description', 'image_generation')
      .gt('created_at', since)
      .order('created_at', { ascending: false })
      .limit(60);
    if (error) throw error;
    const items = (data || [])
      .map(r => ({ id: r.id, created_at: r.created_at, ...(r.metadata || {}) }))
      .filter(x => x.public && Array.isArray(x.images) && x.images.length > 0);
    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 });
  }
}

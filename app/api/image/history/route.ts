import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Find customer's id
    const { data: customer } = await supabase.from('customers').select('id').eq('user_id', user.id).single();
    if (!customer) return NextResponse.json({ logs: [] });

    // Pull recent image generation records from credits_history (last 30 days)
    const since = new Date(Date.now() - 30*24*60*60*1000).toISOString();
    const { data, error } = await supabase
      .from('credits_history')
      .select('id, created_at, description, metadata')
      .eq('customer_id', customer.id)
      .eq('type', 'subtract')
      .eq('description', 'image_generation')
      .gt('created_at', since)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const logs = (data || []).map(r => ({ id: r.id, created_at: r.created_at, ...(r.metadata || {}) }));
    return NextResponse.json({ logs });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 });
  }
}

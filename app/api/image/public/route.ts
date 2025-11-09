import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createServiceRoleClient } from "@/utils/supabase/service-role";

export async function POST(req: Request) {
  try {
    const { id, public: isPublic } = await req.json();
    if (!id || typeof isPublic !== 'boolean') return NextResponse.json({ error: 'Bad request' }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createServiceRoleClient();
    // Resolve customer's id
    const { data: customer } = await admin.from('customers').select('id').eq('user_id', user.id).single();
    if (!customer) return NextResponse.json({ error: 'No customer' }, { status: 404 });

    // Ensure the record belongs to the user
    const { data: rec } = await admin.from('credits_history').select('id, customer_id, metadata').eq('id', id).single();
    if (!rec || rec.customer_id !== customer.id) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const metadata = { ...(rec.metadata || {}), public: !!isPublic };
    const { error } = await admin.from('credits_history').update({ metadata }).eq('id', id);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 });
  }
}

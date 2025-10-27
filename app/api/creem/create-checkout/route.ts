import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const productId: string | undefined = body.productId || process.env.DEFAULT_CREEM_PRODUCT_ID;
    const CREEM_API_URL = process.env.CREEM_API_URL;
    const CREEM_API_KEY = process.env.CREEM_API_KEY;
    const SUCCESS_URL = process.env.CREEM_SUCCESS_URL;

    if (!CREEM_API_URL || !CREEM_API_KEY) {
      return NextResponse.json({ error: "Creem is not configured" }, { status: 500 });
    }
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const reqBody: any = {
      product_id: productId,
      customer: user?.email ? { email: user.email } : undefined,
      metadata: {
        user_id: user?.id || body.userId || "guest",
        product_type: body.productType || "credits",
        credits: body.credits || 0,
      },
    };
    if (SUCCESS_URL) reqBody.success_url = SUCCESS_URL;
    if (body.discountCode) reqBody.discount_code = body.discountCode;

    const res = await fetch(`${CREEM_API_URL}/checkouts`, {
      method: "POST",
      headers: {
        "x-api-key": CREEM_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("Creem checkout error", res.status, t);
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json({ checkoutUrl: data.checkout_url });
  } catch (e: any) {
    console.error("Create checkout exception", e);
    return NextResponse.json({ error: e?.message || "server error" }, { status: 500 });
  }
}

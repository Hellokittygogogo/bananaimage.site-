import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Placeholder: expect providers to be configured via env on Vercel
    const ok = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.STABILITY_API_KEY;
    if (!ok) {
      return NextResponse.json(
        {
          error: "No image API configured. Set your provider keys via Vercel env (e.g. OPENAI_API_KEY / OPENROUTER_API_KEY).",
        },
        { status: 501 }
      );
    }

    // In a real implementation, forward file + prompt to provider
    return NextResponse.json({ message: "API configured. Implement provider call here." });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

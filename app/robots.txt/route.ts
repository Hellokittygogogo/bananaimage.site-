import { NextResponse } from "next/server";
export const dynamic = "force-static";
export async function GET(){
  const lines = [
    '# Content signals and bot rules',
    'User-agent: *',
    'Content-signal: search=yes,ai-train=no',
    'Allow: /',
    '',
    'User-agent: GPTBot',
    'Disallow: /',
    'User-agent: CCBot',
    'Disallow: /',
    'User-agent: Google-Extended',
    'Disallow: /'
  ];
  return new NextResponse(lines.join('\n'),{ headers:{ 'Content-Type':'text/plain; charset=utf-8' } });
}

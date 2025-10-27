import { NextRequest, NextResponse } from "next/server";
const pages = ["/","/sign-in","/sign-up","/pricing","/dashboard","/product/about","/product/popular-names"] as const;
const locales = ["en","zh"] as const;
function esc(s:string){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
export async function GET(req: NextRequest){
  const u = new URL(req.url);
  const base = `${u.protocol}//${u.host}`;
  const items = pages.flatMap((p)=>locales.map((l)=>{
    const loc = esc(base + `/${l}${p}`);
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
  })).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
  return new NextResponse(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
const pages = ["/","/sign-in","/sign-up","/pricing","/dashboard","/generator"] as const;

import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const LOCALES = ["en","zh"] as const;
function pickLocale(req: NextRequest) {
  const cookie = req.cookies.get("NEXT_LOCALE")?.value?.toLowerCase();
  if (cookie && (LOCALES as readonly string[]).includes(cookie)) return cookie;
  const al = (req.headers.get("accept-language") || "").toLowerCase();
  if (al.includes("zh")) return "zh";
  return "en";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // bypass for api/static/assets
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || /\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$/i.test(pathname)) {
    return updateSession(request);
  }

  const seg = pathname.split("/")[1];
  if ((LOCALES as readonly string[]).includes(seg)) {
    const res = await updateSession(request);
    // @ts-ignore cookies on NextResponse
    res.cookies?.set?.("NEXT_LOCALE", seg, { path: "/", maxAge: 60*60*24*365 });
    return res;
  }

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};

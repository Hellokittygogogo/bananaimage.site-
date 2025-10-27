import { type NextRequest, NextResponse } from "next/server";

// No-op middleware to avoid Edge runtime issues
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // still allow middleware pipeline to run lightly (no redirects)
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

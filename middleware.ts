import { NextResponse } from "next/server";

export function middleware() {
  // RLS + client-side auth handle proteksi; middleware dibiarkan pass-through.
  return NextResponse.next();
}

export const config = {
  matcher: ["/catalog/:path*", "/dashboard/:path*", "/checkout/:path*"],
};

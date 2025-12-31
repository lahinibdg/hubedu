import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ error: "Download belum tersedia" }, { status: 501 });
}

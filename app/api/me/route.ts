import { NextResponse } from "next/server";
import { getSessionUser } from "@/utils/auth/session";

export async function GET() {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: session });
}

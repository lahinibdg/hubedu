import { NextResponse } from "next/server";
import crypto from "crypto";

const NONCE_COOKIE = "dv_nonce";
const NONCE_TTL_SECONDS = 60 * 5;

export async function POST() {
  const nonce = crypto.randomBytes(16).toString("hex");
  const res = NextResponse.json({ nonce });
  res.cookies.set(NONCE_COOKIE, nonce, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: NONCE_TTL_SECONDS,
    path: "/",
  });
  return res;
}

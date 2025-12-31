import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export type SessionUser = {
  id: string;
  email?: string | null;
  wallet?: string | null;
  login_type?: "web2" | "web3" | null;
};

type JwtPayload = {
  sub: string;
  email?: string | null;
  wallet?: string | null;
  loginType?: "web2" | "web3" | null;
  iat: number;
  exp: number;
};

export const SESSION_COOKIE_NAME = "dv_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const getSecret = () => {
  const secret = process.env.AUTH_JWT_SECRET || "";
  if (!secret) throw new Error("AUTH_JWT_SECRET belum diset");
  return secret;
};

const base64url = (input: Buffer | string) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const sign = (data: string, secret: string) =>
  base64url(crypto.createHmac("sha256", secret).update(data).digest());

export const signJWT = (payload: Omit<JwtPayload, "iat" | "exp">, expiresInSec = SESSION_MAX_AGE_SECONDS) => {
  const secret = getSecret();
  const header = { alg: "HS256", typ: "JWT" };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSec;
  const body: JwtPayload = { ...payload, iat, exp };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(body));
  const signature = sign(`${encodedHeader}.${encodedPayload}`, secret);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const verifyJWT = (token?: string | null): JwtPayload | null => {
  if (!token) return null;
  const secret = getSecret();
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, signature] = parts;
  const expected = sign(`${encodedHeader}.${encodedPayload}`, secret);
  if (expected.length !== signature.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
  const decode = (str: string) =>
    Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
  try {
    const payload = JSON.parse(decode(encodedPayload)) as JwtPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
};

export const setSessionCookie = (res: NextResponse, user: SessionUser) => {
  const token = signJWT({
    sub: user.id,
    email: user.email || null,
    wallet: normalizeWallet(user.wallet),
    loginType: user.login_type || null,
  });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  return res;
};

export const clearSessionCookie = (res: NextResponse) => {
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return res;
};

export const getSessionUser = (): SessionUser | null => {
  const raw = cookies().get(SESSION_COOKIE_NAME)?.value;
  const payload = verifyJWT(raw);
  if (!payload) return null;
  return {
    id: payload.sub,
    email: payload.email,
    wallet: normalizeWallet(payload.wallet),
    login_type: payload.loginType,
  };
};

export const normalizeWallet = (addr?: string | null) => addr?.trim().toLowerCase() || null;

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyMessage, type Address } from "viem";
import crypto from "crypto";
import { createServiceSupabaseClient } from "@/utils/supabase/server";
import { normalizeWallet, setSessionCookie, type SessionUser } from "@/utils/auth/session";

const NONCE_COOKIE = "dv_nonce";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const addressRaw = body?.address as string;
    const signature = body?.signature as string;
    const nonce = body?.nonce as string;

    const address = normalizeWallet(addressRaw);
    if (!address || !signature || !nonce) {
      return NextResponse.json({ error: "address, signature, nonce diperlukan" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const nonceCookie = cookieStore.get(NONCE_COOKIE)?.value;
    if (!nonceCookie || nonceCookie !== nonce) {
      return NextResponse.json({ error: "Nonce tidak valid" }, { status: 400 });
    }

    const message = `DigitalVault login: ${nonce}`;
    const verified = await verifyMessage({
    address: address as Address,
    message,
    signature: signature as `0x${string}`,
    });

    if (!verified) {
      return NextResponse.json({ error: "Signature tidak valid" }, { status: 401 });
    }

    const supabase = createServiceSupabaseClient();
    const { data: existing, error: existingErr } = await supabase
      .from("users")
      .select("id,email,wallet,login_type")
      .eq("wallet", address)
      .limit(1);
    if (existingErr) throw existingErr;

    let user = existing?.[0];
    if (user) {
      if (user.login_type !== "web3") {
        const { data: updated, error: updateErr } = await supabase
          .from("users")
          .update({ login_type: "web3" })
          .eq("id", user.id)
          .select("id,email,wallet,login_type")
          .single();
        if (updateErr) throw updateErr;
        user = updated;
      }
    } else {
      const { data: created, error: createErr } = await supabase
        .from("users")
        .insert({ wallet: address, login_type: "web3" })
        .select("id,email,wallet,login_type")
        .single();
      if (createErr) throw createErr;
      user = created;
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      wallet: user.wallet,
      login_type: "web3",
    };

    const res = NextResponse.json({ ok: true, user: sessionUser });
    setSessionCookie(res, sessionUser);
    res.cookies.set(NONCE_COOKIE, crypto.randomBytes(8).toString("hex"), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1,
      path: "/",
    });
    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Gagal verifikasi web3" },
      { status: 500 }
    );
  }
}

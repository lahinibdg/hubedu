import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/utils/supabase/server";
import { setSessionCookie, type SessionUser } from "@/utils/auth/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const emailRaw = (body?.email || "").trim().toLowerCase();

    if (!emailRaw) {
      return NextResponse.json({ error: "email diperlukan" }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();
    const { data: existing, error: existingErr } = await supabase
      .from("profiles")
      .select("id,email")
      .eq("email", emailRaw)
      .limit(1);
    if (existingErr) throw existingErr;

    let user = existing?.[0];
    if (!user) {
      const { data: created, error: createErr } = await supabase
        .from("profiles")
        .insert({ email: emailRaw })
        .select("id,email")
        .single();
      if (createErr) throw createErr;
      user = created;
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      wallet: null,
      login_type: "web2",
    };
    const res = NextResponse.json({ user: sessionUser });
    setSessionCookie(res, sessionUser);
    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Gagal login web2" },
      { status: 500 }
    );
  }
}

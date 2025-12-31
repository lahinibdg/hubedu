import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/utils/supabase/server";
import { getSessionUser } from "@/utils/auth/session";

export async function GET() {
  try {
    const sessionUser = getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("purchases")
      .select("id,created_at,product_id,amount,payment_type,status,tx_hash,payload_hash,product:products(name)")
      .eq("user_id", sessionUser.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ purchases: data || [] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Gagal memuat histori pembelian" },
      { status: 500 }
    );
  }
}

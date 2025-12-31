import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/utils/supabase/server";
import { getSessionUser } from "@/utils/auth/session";

export async function GET() {
  try {
    const session = getSessionUser();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("id,name,description,category,price_web2,price_web3")
      .order("name", { ascending: true });
    if (error) throw error;

    const products = (data || []).map((row: any) => ({
      ...row,
      title: row.name,
    }));

    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load products" },
      { status: 500 }
    );
  }
}

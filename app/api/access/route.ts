import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/utils/supabase/server";
import { getSessionUser } from "@/utils/auth/session";

export async function POST(req: Request) {
  try {
    const session = getSessionUser();
    if (!session?.id) {
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }

    const body = await req.json();
    const productId = body?.productId as string;
    if (!productId) {
      return NextResponse.json({ hasAccess: false }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();
    const { data: purchases, error: purchaseErr } = await supabase
      .from("purchases")
      .select("id,status")
      .eq("user_id", session.id)
      .eq("product_id", productId)
      .eq("status", "paid")
      .limit(1);
    if (purchaseErr) throw purchaseErr;

    const hasAccess = !!purchases?.length;
    return NextResponse.json({ hasAccess, unlocked: hasAccess });
  } catch (err: any) {
    return NextResponse.json(
      { hasAccess: false, error: err?.message || "Failed to check access" },
      { status: 500 }
    );
  }
}

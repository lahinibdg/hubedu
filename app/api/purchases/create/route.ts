import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/utils/supabase/server";
import { getSessionUser } from "@/utils/auth/session";

export async function POST(req: Request) {
  try {
    const session = getSessionUser();
    if (!session?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const productId = body?.productId as string;
    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

    const supabase = createServiceSupabaseClient();
    const { data: productRows, error: prodErr } = await supabase
      .from("products")
      .select("id,name,price_web2")
      .eq("id", productId)
      .limit(1);
    if (prodErr) throw prodErr;
    const product = productRows?.[0];
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const amount = product.price_web2 || 0;
    const { data: purchase, error: createErr } = await supabase
      .from("purchases")
      .insert({
        user_id: session.id,
        product_id: productId,
        amount,
        payment_type: "web2",
        status: "pending",
      })
      .select("*")
      .single();
    if (createErr) throw createErr;

    return NextResponse.json({ purchase });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to create purchase" },
      { status: 500 }
    );
  }
}

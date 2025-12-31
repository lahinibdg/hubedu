import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/utils/supabase/server";
import { getSessionUser } from "@/utils/auth/session";
import { computePayloadHash, logPurchaseOnChain } from "@/utils/blockchain/logger";

export async function POST(req: Request) {
  try {
    const session = getSessionUser();
    if (!session?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const purchaseId = body?.purchaseId as string;
    if (!purchaseId) return NextResponse.json({ error: "purchaseId required" }, { status: 400 });

    const supabase = createServiceSupabaseClient();
    const { data: existing, error: fetchErr } = await supabase
      .from("purchases")
      .select("*")
      .eq("id", purchaseId)
      .eq("user_id", session.id)
      .limit(1);
    if (fetchErr) throw fetchErr;
    const purchase = existing?.[0];
    if (!purchase) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const payloadData = {
      purchase_id: purchase.id,
      user_id: purchase.user_id,
      product_id: purchase.product_id,
      amount: purchase.amount,
      created_at: purchase.created_at,
    };
    const { hashHex, json } = computePayloadHash(payloadData);
    const txHash = await logPurchaseOnChain(hashHex);

    const { data: updated, error: updateErr } = await supabase
      .from("purchases")
      .update({ status: "paid", tx_hash: txHash, payload_hash: hashHex })
      .eq("id", purchase.id)
      .select("*")
      .single();
    if (updateErr) throw updateErr;

    return NextResponse.json({ purchase: updated, payload: json, payload_hash: hashHex, tx_hash: txHash });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to mark paid" },
      { status: 500 }
    );
  }
}

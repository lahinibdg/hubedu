import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceSupabaseClient } from "@/utils/supabase/server";
import { getSessionUser } from "@/utils/auth/session";

const BUCKET = process.env.STORAGE_BUCKET || "files";

export async function POST(req: Request) {
  try {
    const session = getSessionUser();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const productId = body?.productId as string;
    if (!productId) {
      return NextResponse.json({ error: "productId diperlukan" }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();

    const { data: productRows, error: prodErr } = await supabase
      .from("products")
      .select("id,name,storage_path,price_web2,price_web3")
      .eq("id", productId)
      .limit(1);
    if (prodErr) throw prodErr;
    const product = productRows?.[0];
    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const txHash = `sim-${crypto.randomBytes(8).toString("hex")}`;
    const amount = product.price_web2 || product.price_web3 || 0;

    const { data: purchase } = await supabase
      .from("purchases")
      .upsert(
        {
          user_id: session.id,
          product_id: productId,
          amount,
          payment_type: body?.paymentType === "web3" ? "web3" : "web2",
          status: "paid",
          tx_hash: txHash,
        },
        { onConflict: "user_id,product_id" }
      )
      .select("id")
      .single();

    const storagePath = product.storage_path;
    if (storagePath) {
      await supabase
        .from("user_files")
        .upsert(
          {
            user_id: session.id,
            product_id: productId,
            storage_path: storagePath,
          },
          { onConflict: "user_id,product_id" }
        );
    }

    // audit trail
    const payload = {
      user_id: session.id,
      product_id: productId,
      amount,
      payment_type: body?.paymentType === "web3" ? "web3" : "web2",
      tx_hash: txHash,
      bucket: BUCKET,
      ts: new Date().toISOString(),
    };
    const payloadStr = JSON.stringify(payload);
    const payloadHash = crypto.createHash("sha256").update(payloadStr).digest("hex");
    if (purchase?.id) {
      await supabase.from("audit_chain").insert({
        purchase_id: purchase.id,
        payload,
        payload_hash: payloadHash,
      });
    }

    return NextResponse.json({ ok: true, tx_hash: txHash });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Gagal mensimulasikan purchase" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json(
      {
        envOk: false,
        pingOk: false,
        pingStatus: null,
        pingBodySnippet: "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum di-set",
      },
      { status: 500 }
    );
  }

  try {
    const pingUrl = `${url}/rest/v1/products?select=id&limit=1`;
    const res = await fetch(pingUrl, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      cache: "no-store",
    });

    const text = await res.text();
    const snippet = text.slice(0, 200);

    return NextResponse.json({
      envOk: true,
      pingOk: res.ok,
      pingStatus: res.status,
      pingBodySnippet: snippet,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        envOk: true,
        pingOk: false,
        pingStatus: null,
        pingBodySnippet: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

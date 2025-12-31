'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import PurchaseHistory from './PurchaseHistory';

type Product = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  price_web2?: number | null;
  storage_path?: string | null;
  is_active?: boolean | null;
};

type LedgerEntry = {
  id: number;
  purchase_id?: string | null;
  prev_hash?: string | null;
  hash: string;
  payload: any;
  created_at?: string | null;
};

type PurchaseRow = {
  id: string;
  created_at?: string | null;
  product_id: string;
  amount_web2?: number | null;
  currency?: string | null;
  status?: string | null;
  product?: Product | null;
  ledger?: LedgerEntry | null;
};

const formatCurrency = (value?: number | null) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
    value ?? 0,
  );

const stableStringify = (value: any): string => {
  const normalize = (val: any): any => {
    if (Array.isArray(val)) return val.map(normalize);
    if (val && typeof val === 'object') {
      return Object.keys(val)
        .sort()
        .reduce((acc, key) => {
          acc[key] = normalize(val[key]);
          return acc;
        }, {} as Record<string, any>);
    }
    return val;
  };
  return JSON.stringify(normalize(value));
};

const sha256Hex = async (input: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export default function CatalogClient() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const [purchaseLoadingId, setPurchaseLoadingId] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setCheckingSession(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setCheckingSession(false);
    });
    return () => {
      active = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const fetchProducts = useCallback(async () => {
    if (!session?.user) return;
    setLoadingProducts(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('products')
        .select('id,name,description,category,price_web2,storage_path,is_active')
        .eq('is_active', true)
        .order('name', { ascending: true });
      if (fetchErr) throw fetchErr;
      setProducts(data || []);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat produk.');
    } finally {
      setLoadingProducts(false);
    }
  }, [session?.user]);

  const fetchPurchases = useCallback(async () => {
    if (!session?.user) return;
    setLoadingPurchases(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('purchases')
        .select(
          'id,created_at,product_id,amount_web2,currency,status,product:products(name,description,price_web2,storage_path),ledger:ledger!left(id,prev_hash,hash,payload,created_at,purchase_id)',
        )
        .order('created_at', { ascending: false });
      if (fetchErr) throw fetchErr;
      setPurchases((data as PurchaseRow[]) || []);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat histori pembelian.');
    } finally {
      setLoadingPurchases(false);
    }
  }, [session?.user]);

  const fetchLedger = useCallback(async () => {
    if (!session?.user) return;
    setLoadingLedger(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('ledger')
        .select('id,purchase_id,prev_hash,hash,payload,created_at')
        .order('id', { ascending: true });
      if (fetchErr) throw fetchErr;
      setLedgerEntries((data as LedgerEntry[]) || []);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat ledger.');
    } finally {
      setLoadingLedger(false);
    }
  }, [session?.user]);

  useEffect(() => {
    if (session?.user) {
      fetchProducts();
      fetchPurchases();
      fetchLedger();
    } else {
      setProducts([]);
      setPurchases([]);
      setLedgerEntries([]);
    }
  }, [session?.user, fetchProducts, fetchPurchases, fetchLedger]);

  const paidProductIds = useMemo(() => {
    const set = new Set<string>();
    purchases.forEach((p) => {
      if ((p.status || '').toUpperCase() === 'PAID') set.add(p.product_id);
    });
    return set;
  }, [purchases]);

  const handlePurchase = async (product: Product) => {
    if (!session?.user) {
      router.push('/login?redirect=/catalog');
      return;
    }
    setPurchaseLoadingId(product.id);
    setMessage(null);
    setError(null);
    try {
      const { error: insertErr } = await supabase.from('purchases').insert({
        user_id: session.user.id,
        product_id: product.id,
        amount_web2: product.price_web2 ?? 0,
        currency: 'IDR',
        status: 'PAID',
      });
      if (insertErr) throw insertErr;
      setMessage('Pembelian tercatat. Ledger akan otomatis di-append.');
      await Promise.all([fetchPurchases(), fetchLedger()]);
    } catch (err: any) {
      setError(err?.message || 'Gagal memproses pembelian.');
    } finally {
      setPurchaseLoadingId(null);
    }
  };

  const handleDownload = (product: Product) => {
    if (!paidProductIds.has(product.id)) {
      setMessage('Beli dulu untuk membuka file.');
      return;
    }
    if (!product.storage_path) {
      setMessage('File belum tersedia. Storage path kosong.');
      return;
    }
    setMessage('Download akan aktif setelah storage diisi.');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProducts([]);
    setPurchases([]);
    setLedgerEntries([]);
  };

  const handleVerifyLedger = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      if (!(globalThis.crypto && crypto.subtle)) {
        setVerifyResult('Browser belum mendukung verifikasi SHA-256.');
        return;
      }
      if (!ledgerEntries.length) {
        setVerifyResult('Belum ada entri ledger untuk diverifikasi.');
        return;
      }
      let prevHash = '';
      const sorted = [...ledgerEntries].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      for (const entry of sorted) {
        const actualPrev = entry.prev_hash ?? '';
        if (actualPrev !== prevHash) {
          setVerifyResult(`TAMPERED: prev_hash tidak cocok pada ledger id ${entry.id}`);
          return;
        }
        const payloadText = stableStringify(entry.payload ?? {});
        const expectedHash = await sha256Hex(`${actualPrev}${payloadText}`);
        if (expectedHash !== entry.hash) {
          setVerifyResult(`TAMPERED: hash tidak valid pada ledger id ${entry.id}`);
          return;
        }
        prevHash = entry.hash;
      }
      setVerifyResult('OK: rantai ledger valid.');
    } catch (err: any) {
      setVerifyResult(err?.message || 'Gagal memverifikasi ledger.');
    } finally {
      setVerifying(false);
    }
  };

  const loggedInEmail = session?.user?.email;

  return (
    <div className="min-h-screen bg-[#0a0718] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Katalog Produk Digital</h1>
            <p className="text-white/70 text-sm">
              Produk disembunyikan sampai kamu login. Pembelian disimpan ke ledger berantai (append-only).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {session ? (
              <>
                <span className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm">
                  {loggedInEmail || 'Session aktif'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:border-white/40 transition"
                >
                  Keluar
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/login?redirect=/catalog')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold"
              >
                Login Web2
              </button>
            )}
          </div>
        </div>

        {checkingSession && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">Memeriksa sesi...</div>
        )}

        {!checkingSession && !session && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold">Belum login</h2>
            <p className="text-white/70 text-sm">
              Silakan login untuk melihat katalog dan melakukan pembelian simulasi.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/login?redirect=/catalog')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold"
              >
                Ke Halaman Login
              </button>
            </div>
          </div>
        )}

        {session && (
          <>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Produk</h2>
                <div className="flex gap-2">
                  <button
                    onClick={fetchProducts}
                    disabled={loadingProducts}
                    className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:border-white/40 disabled:opacity-60"
                  >
                    {loadingProducts ? 'Memuat...' : 'Refresh Produk'}
                  </button>
                  <button
                    onClick={() => {
                      fetchPurchases();
                      fetchLedger();
                    }}
                    disabled={loadingPurchases || loadingLedger}
                    className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:border-white/40 disabled:opacity-60"
                  >
                    {loadingPurchases || loadingLedger ? 'Memuat data...' : 'Refresh Data'}
                  </button>
                </div>
              </div>

              {loadingProducts ? (
                <div className="text-white/70">Memuat produk...</div>
              ) : products.length === 0 ? (
                <div className="text-white/70">Belum ada produk aktif.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => {
                    const alreadyPaid = paidProductIds.has(product.id);
                    const downloadDisabled = !alreadyPaid || !product.storage_path;
                    return (
                      <div key={product.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-lg font-semibold">{product.name}</div>
                            <div className="text-white/70 text-sm">{product.description || '-'}</div>
                            <div className="text-sm text-white/60 mt-1">Kategori: {product.category || 'General'}</div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              alreadyPaid ? 'bg-green-400/20 text-green-200 border border-green-300/30' : 'bg-white/10 text-white border border-white/15'
                            }`}
                          >
                            {alreadyPaid ? 'UNLOCKED' : 'LOCKED'}
                          </span>
                        </div>
                        <div className="text-white font-semibold">{formatCurrency(product.price_web2)}</div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handlePurchase(product)}
                            disabled={purchaseLoadingId === product.id}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold disabled:opacity-60"
                          >
                            {purchaseLoadingId === product.id ? 'Memproses...' : alreadyPaid ? 'Sudah Dibeli' : 'Beli (Simulasi)'}
                          </button>
                          <button
                            onClick={() => handleDownload(product)}
                            disabled={downloadDisabled}
                            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:border-white/40 disabled:opacity-60"
                          >
                            {product.storage_path ? (alreadyPaid ? 'Download' : 'Download terkunci') : 'File belum tersedia'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <PurchaseHistory
              purchases={purchases}
              refreshing={loadingPurchases}
              onRefresh={() => {
                fetchPurchases();
                fetchLedger();
              }}
              verifyResult={verifyResult}
              verifying={verifying}
              onVerifyLedger={handleVerifyLedger}
            />
          </>
        )}

        {message && <div className="text-green-300 text-sm">{message}</div>}
        {error && <div className="text-red-300 text-sm">Error: {error}</div>}
      </div>
    </div>
  );
}

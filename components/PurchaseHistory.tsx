type PurchaseWithLedger = {
  id: string;
  created_at?: string | null;
  product_id: string;
  amount_web2?: number | null;
  currency?: string | null;
  status?: string | null;
  product?: { name?: string | null; price_web2?: number | null; storage_path?: string | null } | null;
  ledger?: { hash: string; prev_hash?: string | null; created_at?: string | null } | null;
};

type Props = {
  purchases: PurchaseWithLedger[];
  refreshing: boolean;
  onRefresh: () => void;
  verifyResult: string | null;
  verifying: boolean;
  onVerifyLedger: () => void;
};

const formatCurrency = (value?: number | null, currency?: string | null) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: currency || 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);

const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleString('id-ID') : '-');

export default function PurchaseHistory({ purchases, refreshing, onRefresh, verifyResult, verifying, onVerifyLedger }: Props) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Riwayat Pembelian</h2>
        <div className="flex gap-2">
          <button
            onClick={onVerifyLedger}
            disabled={verifying || refreshing}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:border-white/40 disabled:opacity-60"
          >
            {verifying ? 'Memverifikasi...' : 'Verifikasi Ledger'}
          </button>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:border-white/40 disabled:opacity-60"
          >
            {refreshing ? 'Memuat...' : 'Refresh'}
          </button>
        </div>
      </div>

      {verifyResult && (
        <div
          className={`text-sm px-3 py-2 rounded-lg ${
            verifyResult.startsWith('OK') ? 'bg-green-400/10 text-green-200 border border-green-300/30' : 'bg-red-400/10 text-red-200 border border-red-300/30'
          }`}
        >
          {verifyResult}
        </div>
      )}

      {purchases.length === 0 ? (
        <div className="text-white/70 text-sm">Belum ada transaksi.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-white/80">
            <thead className="text-xs uppercase text-white/60">
              <tr>
                <th className="py-2 pr-4">Tanggal</th>
                <th className="py-2 pr-4">Produk</th>
                <th className="py-2 pr-4">Harga</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {purchases.map((p) => (
                <tr key={p.id}>
                  <td className="py-2 pr-4">{formatDate(p.created_at)}</td>
                  <td className="py-2 pr-4">{p.product?.name || '-'}</td>
                  <td className="py-2 pr-4">{formatCurrency(p.amount_web2, p.currency)}</td>
                  <td className="py-2 pr-4">{(p.status || '').toUpperCase()}</td>
                  <td className="py-2 pr-4 font-mono text-xs">
                    {p.ledger?.hash ? `${p.ledger.hash.slice(0, 10)}...` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0718] text-white px-4">
      <div className="max-w-lg bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 text-center">
        <h1 className="text-2xl font-bold">Dashboard Web3 dinonaktifkan</h1>
        <p className="text-white/70 text-sm">
          Fitur wallet & dashboard Web3 sementara dimatikan. Silakan gunakan mode Web2 untuk mengakses katalog dan
          riwayat pembelian.
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => router.push('/catalog')}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold"
          >
            Buka Katalog
          </button>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:border-white/40"
          >
            Login Web2
          </button>
        </div>
      </div>
    </div>
  );
}

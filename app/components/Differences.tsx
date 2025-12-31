 'use client';

import { useRouter } from 'next/navigation';

interface DifferencesProps {
  showActions?: boolean;
}

export default function Differences({ showActions = false }: DifferencesProps) {
  const router = useRouter();
  const handleWeb2 = () => router.push('/catalog');
  const handleWeb3 = () => router.push('/dashboard');

  return (
    <section id="differences" className="relative w-full py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_40%)]" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0819]/70 to-[#080614]" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-blue-200 drop-shadow-[0_10px_35px_rgba(126,58,237,0.35)]">
            Web2 vs Web3
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Pilih mode sesuai kebutuhan: akselerasi akses Web2 atau kendali penuh dan kepemilikan di Web3.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: 'Web2',
              accent: 'from-purple-500/30 to-indigo-500/20',
              points: [
                'Login cepat tanpa wallet',
                'Akses tersentral dan responsif',
                'Pengelolaan akun & kontrol berbasis server',
                'Optimal untuk kebutuhan kolaborasi harian',
              ],
              badge: 'Fast Mode',
            },
            {
              title: 'Web3',
              accent: 'from-blue-500/25 to-teal-400/20',
              points: [
                'Autentikasi wallet, kepemilikan aset pribadi',
                'Desentralisasi & verifikasi on-chain',
                'Akses berbasis kepemilikan, bukan akun terpusat',
                'Kedaulatan data & interoperabilitas multi-chain',
              ],
              badge: 'Ownership',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-purple-900/25 p-8"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-70`}
                aria-hidden
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_30%)]" aria-hidden />
              <div className="relative flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white">{card.title}</span>
                  <span className="px-3 py-1 rounded-full text-xs text-white/90 border border-white/20 bg-white/10">
                    {card.badge}
                  </span>
                </div>
                <ul className="space-y-3 text-gray-100/90">
                  {card.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400" />
                      <span className="text-base">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {showActions && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={handleWeb2}
              className="px-6 sm:px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white/90 hover:text-white hover:border-white/40 backdrop-blur-lg transition-transform hover:-translate-y-0.5"
            >
              Gunakan Web2
            </button>
            <button
              onClick={handleWeb3}
              className="px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-semibold shadow-lg shadow-purple-900/40 hover:shadow-purple-700/40 transition-transform hover:-translate-y-0.5"
            >
              Gunakan Web3
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

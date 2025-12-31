'use client';

import { useRouter } from 'next/navigation';
import FadeContent from './FadeContent/FadeContent';
import Cubes from './Cube/Cubes';

interface HeroProps {
  onConnectAndRedirect: () => void;
}

export default function Hero({ onConnectAndRedirect }: HeroProps) {
  const router = useRouter();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-24"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0617]/70 to-[#05030d] z-0" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.25),transparent_40%)] z-0" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.22),transparent_35%)] z-0" aria-hidden />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-purple-500/10 blur-[120px] rounded-full z-0" aria-hidden />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="grid items-center gap-12 lg:gap-16 lg:grid-cols-2">
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              <FadeContent
                as="span"
                text="DIGITALVAULT - DECENTRALIZED FILE STORAGE"
                className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-blue-200 drop-shadow-[0_10px_35px_rgba(126,58,237,0.45)] cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
              />
            </h1>

            <FadeContent
              as="p"
              text="Simpan, kelola, dan lindungi aset digital dengan kontrol kepemilikan Web3 dan kecepatan Web2."
              className="text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0"
            />

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={onConnectAndRedirect}
                className="px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-semibold shadow-[0_20px_60px_rgba(99,102,241,0.35)] hover:shadow-[0_25px_70px_rgba(99,102,241,0.45)] transition-transform hover:-translate-y-0.5"
              >
                <FadeContent as="span" text="Masuk Web3" />
              </button>
              <button
                onClick={() => router.push('/catalog')}
                className="px-8 sm:px-10 py-4 rounded-full border border-white/30 text-white/90 bg-white/10 backdrop-blur-lg hover:border-white/60 transition-colors shadow-inner shadow-white/5"
              >
                <FadeContent as="span" text="Masuk Web2" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs sm:text-sm uppercase tracking-[0.18em] text-white/70">
              {['Secure', 'Web3 Ready', 'Web2 Friendly'].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm shadow-purple-900/30"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/25 to-blue-500/15 blur-3xl z-0" aria-hidden />
            <div className="relative rounded-[28px] bg-white/5 border border-white/10 backdrop-blur-xl p-8 shadow-2xl shadow-purple-900/30">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.18),transparent_32%)] z-0" aria-hidden />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-wide text-white/70">Menggunakan sistem Blockchain</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white">Live</span>
                </div>
                <div className="flex items-center justify-center">
                  <Cubes />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientOnly from './components/ClientOnly';
import Silk from './components/Silk/Silk';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyChoose from './components/WhyChoose';
import Differences from './components/Differences';
import LogoLoopSection from './components/LogoLoopSection';
import About from './components/About';
import CTASection from './components/CTASection';

export default function Home() {
  const router = useRouter();
  const [infoMsg, setInfoMsg] = useState<string | null>('Mode Web3 sedang dinonaktifkan. Gunakan Email + Password (Web2) untuk akses katalog.');

  const handleWeb3Disabled = () => {
    setInfoMsg('Mode Web3 akan hadir nanti. Saat ini, gunakan login Web2 untuk menjelajah katalog & melakukan pembelian.');
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToComparison = () => {
    const target = document.getElementById('differences');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    router.push('/comparison');
  };

  const scrollToGetStarted = () => {
    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0718] overflow-x-hidden">
      <ClientOnly>
        <div className="pointer-events-none fixed inset-0 z-0">
          <Silk speed={3} scale={1.2} color="#7c3aed" noiseIntensity={0.6} rotation={0.2} />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar onScrollToAbout={scrollToAbout} onGoToComparison={goToComparison} onGetStarted={scrollToGetStarted} />

          <main className="flex-1 overflow-visible">
            <Hero onConnectAndRedirect={handleWeb3Disabled} />
            <WhyChoose />
            <Differences />
            <LogoLoopSection />
            <About />
            <div id="get-started">
              <CTASection
                onWeb3={handleWeb3Disabled}
                onWeb2={() => router.push('/login')}
              />
            </div>

            <footer className="py-10 text-center text-sm text-gray-400 bg-[#05030d]/80">
              (c) 2025 DigitalVault - Web2.5 File Locker
            </footer>
          </main>

          {infoMsg && (
            <div className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-lg shadow-purple-900/30 text-white text-sm space-y-2">
              <p>{infoMsg}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/login')}
                  className="px-3 py-2 rounded-md bg-white/20 border border-white/30 hover:border-white/60 transition"
                >
                  Login Web2
                </button>
                <button
                  onClick={() => router.push('/catalog')}
                  className="px-3 py-2 rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-md"
                >
                  Buka Katalog
                </button>
              </div>
            </div>
          )}
        </div>
      </ClientOnly>
    </div>
  );
}

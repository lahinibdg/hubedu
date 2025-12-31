'use client';

interface NavbarProps {
  onScrollToAbout: () => void;
  onGoToComparison: () => void;
  onGetStarted: () => void;
}

export default function Navbar({ onScrollToAbout, onGoToComparison, onGetStarted }: NavbarProps) {
  // Web3 wallet UI dinonaktifkan untuk fokus Web2.

  return (
    <nav className="fixed inset-x-0 top-0 w-full z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b16]/90 via-[#0e0c1f]/85 to-[#0b1029]/90 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-purple-900/30" />
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500/70 to-transparent blur-[1px]" />

      <div className="relative max-w-7xl w-full mx-auto px-6">
        <div className="flex h-[72px] items-center justify-between">
          {/* Brand Kiri */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white font-extrabold text-xl tracking-tight flex items-center gap-2"
            >
              <span className="relative">
                <span className="absolute -inset-1 rounded-lg bg-purple-500/30 blur-xl" aria-hidden />
                <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-blue-200">
                  DigitalVault
                </span>
              </span>
            </button>
          </div>

          {/* Menu Center */}
          <div className="hidden sm:flex items-center gap-6 text-sm sm:text-base absolute left-1/2 -translate-x-1/2">
            <button
              onClick={onScrollToAbout}
              className="text-white/85 hover:text-white transition-colors relative group py-2"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all group-hover:w-full" />
            </button>
            <button
              onClick={onGoToComparison}
              className="text-white/85 hover:text-white transition-colors relative group py-2"
            >
              Web2 vs Web3
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all group-hover:w-full" />
            </button>
          </div>

          {/* Tombol Kanan */}
          <div className="flex items-center gap-3 sm:gap-5 text-sm sm:text-base flex-shrink-0">
            <button
              onClick={onGetStarted}
              className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg shadow-purple-900/40 hover:shadow-purple-700/40 transition-transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

interface CTASectionProps {
  onWeb3: () => void;
  onWeb2: () => void;
}

export default function CTASection({ onWeb3, onWeb2 }: CTASectionProps) {
  return (
    <section className="relative w-full py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#06040d] via-[#0a0720] to-[#05030c]" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(124,58,237,0.22),transparent_38%)]" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(59,130,246,0.18),transparent_35%)]" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 sm:p-12 shadow-2xl shadow-purple-900/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/15 via-transparent to-blue-500/15" aria-hidden />
          <div className="absolute -inset-x-20 -top-32 h-40 bg-gradient-to-r from-purple-500/30 via-pink-400/10 to-blue-500/25 blur-3xl" aria-hidden />

          <div className="relative text-center space-y-5">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_10px_35px_rgba(126,58,237,0.35)]">
              Ready to Secure Your Digital Files?
            </h3>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Mulai sekarang dan nikmati penyimpanan premium dengan kecepatan Web2 serta kepemilikan Web3.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button
                onClick={onWeb3}
                className="px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-semibold shadow-[0_20px_60px_rgba(99,102,241,0.35)] hover:shadow-[0_25px_70px_rgba(99,102,241,0.45)] transition-transform hover:-translate-y-0.5"
              >
                Get Started (Web3)
              </button>
              <button
                onClick={onWeb2}
                className="px-8 sm:px-10 py-4 rounded-full border border-white/30 text-white/90 bg-white/10 backdrop-blur-lg hover:border-white/60 transition-colors shadow-inner shadow-white/5"
              >
                Explore Web2
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

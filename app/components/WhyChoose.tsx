const features = [
  { title: 'Ownership Control', desc: 'Aset dan akses sepenuhnya milik Anda tanpa otoritas terpusat.' },
  { title: 'Wallet-Based Access', desc: 'Identitas native Web3 dengan autentikasi wallet, tanpa kredensial tradisional.' },
  { title: 'Trustless Verification', desc: 'Validasi tanpa kepercayaan pihak ketiga, berbasis kriptografi.' },
  { title: 'On-chain Security', desc: 'Transparansi dan jejak keamanan yang dapat diaudit di jaringan blockchain.' },
  { title: 'Transparency', desc: 'Data dan izin dapat dilacak, meminimalkan risiko shadow access.' },
  { title: 'Permissionless', desc: 'Akses terbuka sesuai kepemilikan — tidak terkunci oleh penyedia.' },
];

export default function WhyChoose() {
  return (
    <section className="relative w-full py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0617] via-[#0c0a1c] to-[#06040f]" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.25),transparent_35%)]" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.18),transparent_28%)]" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-6 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-blue-200">
            Kenapa Memilih Web3?
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Kontrol penuh, transparansi, dan kepemilikan digital tanpa perantara.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl shadow-purple-900/25 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-800/40"
            >
              <div
                className="absolute inset-0 opacity-60 bg-gradient-to-br from-purple-500/15 via-transparent to-blue-500/15"
                aria-hidden
              />
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-purple-500/25 to-transparent blur-3xl" aria-hidden />
              <div className="relative space-y-3">
                <div className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-gray-200 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <section id="about" className="relative w-full py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-[#090714] via-[#0c0a1c] to-[#05030d]" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-blue-200">
          Tentang DigitalVault
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-300 leading-relaxed">
          DigitalVault adalah platform penyimpanan file Web2.5 premium yang memadukan kecepatan akses Web2
          dengan kepemilikan on-chain Web3. Kelola konten Anda dengan enkripsi end-to-end, dukungan wallet,
          dan pengalaman pengguna yang dirancang untuk tim modern.
        </p>
      </div>
    </section>
  );
}

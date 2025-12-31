'use client';

import Image from 'next/image';

type LogoItem = { name: string; src: string };

const LOGOS: LogoItem[] = [
  { name: 'MetaMask', src: '/logos/metamask.jpg' },
  { name: 'WalletConnect', src: '/logos/Walletconnect.png' },
  { name: 'Next.js', src: '/logos/nextjs.svg' },
  { name: 'React', src: '/logos/react.png' },
  { name: 'TypeScript', src: '/logos/typescript.png' },
  { name: 'Tailwind', src: '/logos/tailwind.png' },
  { name: 'VS Code', src: '/logos/vscode.png' },
];

export default function LogoLoop() {
  // Trick marquee: duplikasi list 2x supaya seamless
  const track = [...LOGOS, ...LOGOS];

  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Built With Modern Technologies
        </h2>
        <p className="mt-2 text-white/70">
          Powered by cutting-edge tools and frameworks for the best user experience.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 overflow-hidden">
          {/* viewport */}
          <div className="relative overflow-hidden">
            {/* track */}
            <div className="logo-marquee group flex w-max gap-4 will-change-transform">
              {track.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md
                             shadow-[0_0_0_1px_rgba(255,255,255,0.05)] hover:bg-white/10 transition"
                >
                  {/* kalau kamu belum punya icon file, comment Image dan pakai huruf saja */}
                  <div className="relative h-6 w-6">
                    <Image
                      src={item.src}
                      alt={item.name}
                      fill
                      className="object-contain"
                      sizes="24px"
                      priority={idx < 6}
                    />
                  </div>

                  <span className="text-white/90 text-sm md:text-base whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            {/* fade edges biar keren */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#070616] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#070616] to-transparent" />
          </div>

          <p className="mt-4 text-xs text-white/50">
            Hover untuk pause.
          </p>
        </div>
      </div>
    </section>
  );
}

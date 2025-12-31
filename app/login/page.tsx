'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get('redirect') || '/catalog';

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) router.replace(redirectTo);
    });
    return () => {
      active = false;
    };
  }, [router, redirectTo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!email || !password) {
      setError('Isi email dan password terlebih dahulu.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
          },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          router.replace(redirectTo);
          return;
        }
        setMessage('Akun dibuat. Silakan cek email (jika diminta) lalu login.');
        setMode('login');
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        if (data.session) {
          router.replace(redirectTo);
        } else {
          setMessage('Login berhasil, mengarahkan ke katalog...');
          setTimeout(() => router.replace(redirectTo), 500);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal memproses autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0718] px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 text-white backdrop-blur">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{mode === 'login' ? 'Masuk Web2' : 'Daftar Web2'}</h1>
          <button
            onClick={() => setMode((m) => (m === 'login' ? 'signup' : 'login'))}
            className="text-sm text-white/80 underline"
          >
            {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
          </button>
        </div>
        <p className="text-sm text-white/70 mb-4">
          Gunakan email + password. Magic link dinonaktifkan agar bebas limit email.
        </p>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-white/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email kamu"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/80">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold disabled:opacity-60"
          >
            {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        {message && <div className="text-green-300 text-sm mt-3">{message}</div>}
        {error && <div className="text-red-300 text-sm mt-3">{error}</div>}

        <div className="mt-4 text-sm text-white/70">
          Setelah login berhasil, kamu akan diarahkan ke katalog produk.
        </div>
      </div>
    </div>
  );
}

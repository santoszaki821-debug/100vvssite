'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, LogIn, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BrandMark } from '@/components/BrandMark';
import { api, saveSession } from '@/lib/api';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await api<{ accessToken: string; user: { id: string; username: string; role: string } }>(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      saveSession(result.accessToken, result.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-5 py-8">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel w-full max-w-md rounded-[32px] p-7">
        <BrandMark />
        <div className="mt-8 grid grid-cols-2 rounded-full bg-black/25 p-1">
          <button onClick={() => setMode('register')} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === 'register' ? 'bg-ruby text-white shadow-glow' : 'text-ruby/70'}`}>
            Inscription
          </button>
          <button onClick={() => setMode('login')} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-ruby text-white shadow-glow' : 'text-ruby/70'}`}>
            Connexion
          </button>
        </div>

        {mode === 'register' && (
          <div className="mt-5 rounded-3xl border border-ruby/25 bg-ruby/10 p-4 text-sm leading-6 text-ink">
            <div className="mb-2 flex items-center gap-2 font-semibold"><AlertTriangle size={17} /> Important</div>
            Choisissez un mot de passe que vous connaissez parfaitement. Aucun système de récupération n'existe. Si vous l'oubliez, il sera impossible de le récupérer ou de le modifier.
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-wine">Nom d'utilisateur</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-ruby" placeholder="pseudo_unique" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-wine">Mot de passe</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-ruby" placeholder="Minimum 8 caracteres" />
          </label>
          {error && <p className="rounded-2xl bg-ruby px-4 py-3 text-sm text-white">{error}</p>}
          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ruby px-5 py-3 font-semibold text-white shadow-premium transition hover:bg-wine disabled:opacity-60">
            {mode === 'register' ? <UserPlus size={18} /> : <LogIn size={18} />}
            {loading ? 'Verification...' : mode === 'register' ? 'Creer mon profil' : 'Entrer'}
          </button>
        </form>
      </motion.section>
    </main>
  );
}

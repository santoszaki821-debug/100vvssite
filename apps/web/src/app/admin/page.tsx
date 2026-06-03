'use client';

import { useEffect, useState } from 'react';
import { Activity, FileClock, MessageSquare, Shield, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { api } from '@/lib/api';

type Stats = {
  users: number;
  online: number;
  newAccounts: number;
  messages24h: number;
  logs: { id: string; action: string; entity: string; createdAt: string; actor?: { username: string } }[];
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Stats>('/admin/stats').then(setStats).catch((err) => setError(err.message));
  }, []);

  const cards: [LucideIcon, string, number][] = [
    [Users, 'Utilisateurs', stats?.users ?? 0],
    [Activity, 'Connectes', stats?.online ?? 0],
    [Shield, 'Nouveaux comptes', stats?.newAccounts ?? 0],
    [MessageSquare, 'Messages 24h', stats?.messages24h ?? 0],
  ];

  return (
    <main className="min-h-screen px-5 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BrandMark />
          <a href="/dashboard" className="rounded-full bg-ruby px-5 py-2 text-sm font-semibold text-white shadow-premium">Retour</a>
        </div>
        <section className="glass-panel mt-8 rounded-[32px] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ruby/50">panel fondateur</p>
          <h1 className="mt-2 text-3xl font-semibold text-wine">Dashboard administrateur</h1>
          {error && <p className="mt-4 rounded-2xl bg-ruby px-4 py-3 text-white">{error}</p>}
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {cards.map(([Icon, label, value]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <Icon className="text-ruby" size={22} />
                <p className="mt-4 text-sm font-semibold text-ruby/60">{label}</p>
                <p className="mt-1 text-3xl font-semibold text-wine">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel mt-6 rounded-[32px] p-6">
          <div className="flex items-center gap-2 text-wine"><FileClock size={20} /><h2 className="text-xl font-semibold">Logs complets</h2></div>
          <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
            {(stats?.logs ?? []).map((log) => (
              <div key={log.id} className="grid gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1fr_1fr_180px]">
                <span className="font-semibold text-wine">{log.action}</span>
                <span className="text-ink/60">{log.actor?.username ?? 'system'} / {log.entity}</span>
                <span className="text-ruby/70">{new Date(log.createdAt).toLocaleString('fr-FR')}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

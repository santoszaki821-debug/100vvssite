'use client';

import { motion } from 'framer-motion';
import { Activity, Crown, Gamepad2, Radio, Sparkles, Trophy, Users, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { ProfileCard } from '@/components/ProfileCard';

const stats = [
  ['Membres', '1 284', '+18 aujourd hui'],
  ['En ligne', '76', 'temps reel'],
  ['Messages', '24.8k', '+312 / 24h'],
  ['XP gagnee', '91k', 'saison neon'],
];

const activity = [
  ['100vvs', 'a epingle le salon General', 'maintenant'],
  ['NOVA', 'a gagne Roulette de la chance', '2 min'],
  ['Yume', 'a debloque le succes Mind Reader', '8 min'],
  ['Kairo', 'a lance une roue Hot en live', '13 min'],
];

const online = ['100vvs', 'NOVA', 'Yume', 'Kairo', 'Sora', 'Neon', 'Lynx'];

const events = [
  ['Live wheel night', 'Roues normale, drole et hot pour animer le chat', '21:00'],
  ['Quiz premium', 'Culture web, musique, reflexes et devinettes', '22:30'],
  ['XP rush', 'Bonus x2 sur tous les mini-jeux', 'En cours'],
];

const rankings = [
  ['NOVA', '12 480 XP'],
  ['100vvs', '11 920 XP'],
  ['Yume', '9 740 XP'],
  ['Kairo', '8 310 XP'],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden px-5 py-6 md:px-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <BrandMark />
        <div className="flex gap-2">
          <Link href="/games" className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-wine hover:border-ruby/50 hover:bg-ruby/15">Jeux</Link>
          <Link href="/wheels" className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-wine hover:border-ruby/50 hover:bg-ruby/15">Roues</Link>
          <Link href="/auth" className="rounded-full bg-ruby px-5 py-2 text-sm font-semibold text-white shadow-glow hover:bg-violet-500">Entrer</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-8 py-10 xl:grid-cols-[1fr_400px] xl:items-start">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-ruby/25 bg-ruby/10 px-4 py-2 text-sm font-semibold text-ruby shadow-glow">
            <Sparkles size={16} /> plateforme communautaire nouvelle generation
          </div>
          <div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-wine md:text-7xl">
              100vvs, communaute privee neon pour discuter, jouer et animer tes lives.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink">
              Un espace anonyme sous pseudonyme avec chat temps reel, profils premium, mini-jeux, classements XP et roues interactives pretes pour le live.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/auth" className="rounded-2xl bg-ruby px-6 py-3 font-semibold text-white shadow-glow">Rejoindre 100vvs</Link>
            <Link href="/dashboard" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-wine hover:bg-white/10">Ouvrir le hub</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(([label, value, hint]) => (
              <motion.div whileHover={{ y: -4 }} key={label} className="glass-panel rounded-3xl p-5">
                <p className="text-sm font-semibold text-ruby/80">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-wine">{value}</p>
                <p className="mt-1 text-xs text-ink/70">{hint}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, delay: 0.1 }} className="animate-float">
          <ProfileCard
            profile={{
              displayName: '100vvs',
              avatarUrl: '/avatar-founder.svg',
              bannerUrl: '/banner-premium.svg',
              bio: 'Fondateur de la communaute. Hub premium, jeux, roues live et presence signature.',
              status: 'Founder online',
              nameColor: '#c084fc',
              theme: 'PREMIUM',
            }}
          />
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 pb-10 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <Panel icon={Activity} title="Activite recente">
          {activity.map(([name, action, time]) => <FeedItem key={`${name}-${action}`} name={name} text={action} meta={time} />)}
        </Panel>
        <Panel icon={Users} title="Membres en ligne">
          <div className="flex flex-wrap gap-2">
            {online.map((name) => <span key={name} className="rounded-full border border-ruby/20 bg-ruby/10 px-3 py-2 text-sm font-semibold text-wine"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.8)]" />{name}</span>)}
          </div>
        </Panel>
        <Panel icon={Trophy} title="Classements">
          {rankings.map(([name, xp], index) => <FeedItem key={name} name={`${index + 1}. ${name}`} text={xp} meta="saison" />)}
        </Panel>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 pb-12 lg:grid-cols-3">
        {events.map(([title, text, time]) => (
          <motion.article whileHover={{ y: -5 }} key={title} className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between gap-3">
              <Radio className="text-ruby" size={22} />
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-ink">{time}</span>
            </div>
            <h3 className="mt-5 text-xl font-semibold text-wine">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/75">{text}</p>
          </motion.article>
        ))}
      </section>
    </main>
  );
}

function Panel({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <section className="glass-panel rounded-3xl p-6">
      <div className="mb-5 flex items-center gap-2 text-wine"><Icon size={20} className="text-ruby" /><h2 className="text-xl font-semibold">{title}</h2></div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function FeedItem({ name, text, meta }: { name: string; text: string; meta: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div>
        <p className="font-semibold text-wine">{name}</p>
        <p className="text-sm text-ink/70">{text}</p>
      </div>
      <span className="text-xs font-semibold text-ruby/80">{meta}</span>
    </div>
  );
}

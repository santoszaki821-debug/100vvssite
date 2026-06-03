'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Crown, Dice5, Gamepad2, History, Medal, RotateCcw, Scissors, Sparkles, Trophy } from 'lucide-react';
import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';

const basePlayers = [
  ['NOVA', 12480, 'Roulette King'],
  ['100vvs', 11920, 'Founder streak'],
  ['Yume', 9740, 'Quiz master'],
  ['Kairo', 8310, 'Dice hunter'],
  ['Sora', 7050, 'Riddle mind'],
];

const achievements = [
  ['First blood', 'Premiere victoire en mini-jeu', 'unlocked'],
  ['Mind Reader', '5 bonnes reponses de quiz', 'unlocked'],
  ['Lucky spin', 'Gagner a la roulette', 'rare'],
  ['Dice storm', 'Faire trois doubles', 'locked'],
];

const history = [
  ['NOVA', 'Roulette de la chance', '+420 XP'],
  ['100vvs', 'Pierre feuille ciseaux', '+180 XP'],
  ['Yume', 'Quiz', '+260 XP'],
  ['Kairo', 'Bataille de des', '+310 XP'],
];

const quiz = [
  { q: 'Quelle techno sert au temps reel de 100vvs ?', a: 'socket.io' },
  { q: 'Quel hash protege les mots de passe ?', a: 'argon2' },
  { q: 'Quel role possede le createur ?', a: 'founder' },
];

export default function GamesPage() {
  const [xp, setXp] = useState(11920);
  const [streak, setStreak] = useState(0);
  const [wins, setWins] = useState(24);
  const [liveHistory, setLiveHistory] = useState(history);
  const [rps, setRps] = useState('Choisis ton move.');
  const [guessTarget, setGuessTarget] = useState(() => Math.floor(Math.random() * 50) + 1);
  const [guess, setGuess] = useState('');
  const [guessText, setGuessText] = useState('Nombre secret entre 1 et 50.');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizText, setQuizText] = useState('Reponds pour gagner de l XP.');
  const [dice, setDice] = useState<[number, number]>([3, 5]);
  const [roulette, setRoulette] = useState('Spin pret.');
  const riddle = useMemo(() => ({ q: 'Je monte sans jamais marcher. Qui suis-je ?', a: 'score' }), []);
  const players = useMemo(() => {
    const updated = basePlayers.map((player) => (player[0] === '100vvs' ? ['100vvs', xp, `${streak} streak`] : player));
    return updated.sort((a, b) => Number(b[1]) - Number(a[1]));
  }, [streak, xp]);

  function grantXp(amount: number, source: string) {
    setXp((current) => current + amount);
    setStreak((current) => current + 1);
    setWins((current) => current + 1);
    setLiveHistory((current) => [['100vvs', source, `+${amount} XP`], ...current].slice(0, 8));
  }

  function playRps(choice: string) {
    const bot = ['pierre', 'feuille', 'ciseaux'][Math.floor(Math.random() * 3)];
    const win = (choice === 'pierre' && bot === 'ciseaux') || (choice === 'feuille' && bot === 'pierre') || (choice === 'ciseaux' && bot === 'feuille');
    if (win) grantXp(180, 'Pierre feuille ciseaux');
    if (!win && choice !== bot) setStreak(0);
    setRps(choice === bot ? `Egalite contre ${bot}.` : win ? `Victoire contre ${bot}. +180 XP` : `Defaite contre ${bot}.`);
  }

  function checkGuess() {
    const value = Number(guess);
    if (!value) return;
    if (value === guessTarget) {
      setGuessText('Trouve. +300 XP');
      grantXp(300, 'Plus ou moins');
      setGuessTarget(Math.floor(Math.random() * 50) + 1);
      setGuess('');
      return;
    }
    setGuessText(value < guessTarget ? 'Plus haut.' : 'Plus bas.');
  }

  function checkQuiz() {
    const ok = quizAnswer.trim().toLowerCase() === quiz[quizIndex].a;
    setQuizText(ok ? '+260 XP. Bonne reponse.' : 'Presque. Retente.');
    if (ok) {
      grantXp(260, 'Quiz');
      setQuizIndex((quizIndex + 1) % quiz.length);
      setQuizAnswer('');
    }
  }

  function rollDice() {
    const next: [number, number] = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
    setDice(next);
    if (next[0] === next[1]) grantXp(310, 'Bataille de des');
  }

  function spinRoulette() {
    const prizes = [
      { label: '+50 XP', xp: 50 },
      { label: '+200 XP', xp: 200 },
      { label: 'badge chance', xp: 120 },
      { label: 'defi chat', xp: 90 },
      { label: 'relance', xp: 25 },
      { label: 'jackpot +500 XP', xp: 500 },
    ];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    setRoulette(prize.label);
    grantXp(prize.xp, 'Roulette de la chance');
  }

  return (
    <main className="min-h-screen px-5 py-6 md:px-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <BrandMark />
        <div className="flex gap-2">
          <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-wine">Accueil</Link>
          <Link href="/wheels" className="rounded-full bg-ruby px-5 py-2 text-sm font-semibold text-white shadow-glow">Roues</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-5 py-8 xl:grid-cols-[1fr_360px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ruby/70">categorie jeux</p>
          <h1 className="mt-3 text-5xl font-semibold text-wine md:text-7xl">Arena XP 100vvs</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/75">Classements, succes, historique des victoires et mini-jeux rapides pour faire vivre la communaute.</p>
          <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
            <XpCard label="Votre XP" value={xp.toLocaleString('fr-FR')} />
            <XpCard label="Victoires" value={String(wins)} />
            <XpCard label="Streak" value={String(streak)} />
          </div>
        </div>
        <section className="glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-2 text-wine"><Trophy className="text-ruby" /><h2 className="text-xl font-semibold">Classement joueurs</h2></div>
          <div className="mt-5 space-y-3">
            {players.map(([name, xp, title], index) => (
              <div key={name} className="grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-2xl bg-white/[0.04] px-4 py-3">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-ruby/15 text-sm font-semibold text-ruby">{index + 1}</span>
                <div><p className="font-semibold text-wine">{name}</p><p className="text-xs text-ink/60">{title}</p></div>
                <span className="font-semibold text-ruby">{xp} XP</span>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 pb-8 lg:grid-cols-3">
        <MiniGame icon={Scissors} title="Pierre feuille ciseaux" result={rps}>
          <div className="grid grid-cols-3 gap-2">{['pierre', 'feuille', 'ciseaux'].map((item) => <button key={item} onClick={() => playRps(item)} className="rounded-2xl bg-ruby/15 px-3 py-3 text-sm font-semibold text-wine hover:bg-ruby/25">{item}</button>)}</div>
        </MiniGame>
        <MiniGame icon={Brain} title="Plus ou moins" result={guessText}>
          <div className="flex gap-2"><input value={guess} onChange={(event) => setGuess(event.target.value)} className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none" placeholder="Nombre" /><button onClick={checkGuess} className="rounded-2xl bg-ruby px-4 py-3 font-semibold text-white">OK</button></div>
        </MiniGame>
        <MiniGame icon={Sparkles} title="Quiz" result={quizText}>
          <p className="mb-3 text-sm text-ink/75">{quiz[quizIndex].q}</p>
          <div className="flex gap-2"><input value={quizAnswer} onChange={(event) => setQuizAnswer(event.target.value)} className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none" /><button onClick={checkQuiz} className="rounded-2xl bg-ruby px-4 py-3 font-semibold text-white">Valider</button></div>
        </MiniGame>
        <MiniGame icon={Medal} title="Devinettes" result="Reponse: score">
          <p className="text-sm text-ink/75">{riddle.q}</p>
        </MiniGame>
        <MiniGame icon={RotateCcw} title="Roulette de la chance" result={roulette}>
          <button onClick={spinRoulette} className="w-full rounded-2xl bg-[linear-gradient(135deg,#a855f7,#22d3ee)] px-4 py-3 font-semibold text-white shadow-glow">Spin</button>
        </MiniGame>
        <MiniGame icon={Dice5} title="Bataille de des" result={`${dice[0]} + ${dice[1]} = ${dice[0] + dice[1]}`}>
          <button onClick={rollDice} className="w-full rounded-2xl bg-ruby px-4 py-3 font-semibold text-white shadow-glow">Lancer les des</button>
        </MiniGame>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 pb-10 lg:grid-cols-2">
        <InfoPanel icon={Crown} title="Succes">
          {achievements.map(([name, text, state]) => <Row key={name} left={name} center={text} right={state} />)}
        </InfoPanel>
        <InfoPanel icon={History} title="Historique des victoires">
          {liveHistory.map(([name, game, amount], index) => <Row key={`${name}-${game}-${index}`} left={name} center={game} right={amount} />)}
        </InfoPanel>
      </section>
    </main>
  );
}

function XpCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="glass-panel rounded-3xl p-5">
      <p className="text-sm font-semibold text-ruby">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-wine">{value}</p>
    </motion.div>
  );
}

function MiniGame({ icon: Icon, title, result, children }: { icon: typeof Gamepad2; title: string; result: string; children: React.ReactNode }) {
  return (
    <motion.article whileHover={{ y: -5 }} className="glass-panel rounded-3xl p-6">
      <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-wine"><Icon size={20} className="text-ruby" /><h2 className="font-semibold">{title}</h2></div><span className="rounded-full bg-ruby/15 px-3 py-1 text-xs font-semibold text-ruby">live</span></div>
      <div className="mt-5">{children}</div>
      <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-ink">{result}</p>
    </motion.article>
  );
}

function InfoPanel({ icon: Icon, title, children }: { icon: typeof Trophy; title: string; children: React.ReactNode }) {
  return <section className="glass-panel rounded-3xl p-6"><div className="mb-5 flex items-center gap-2 text-wine"><Icon className="text-ruby" /><h2 className="text-xl font-semibold">{title}</h2></div><div className="space-y-3">{children}</div></section>;
}

function Row({ left, center, right }: { left: string; center: string; right: string }) {
  return <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm md:grid-cols-[140px_1fr_auto]"><span className="font-semibold text-wine">{left}</span><span className="text-ink/70">{center}</span><span className="font-semibold text-ruby">{right}</span></div>;
}

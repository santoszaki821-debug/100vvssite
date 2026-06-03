'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Flame, Heart, Laugh, ListPlus, Mic2, Radio, RotateCw, Sparkles, Trash2, UserRound, Volume2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';

type WheelMode = 'prompt' | 'quiz';
type WheelItem = { text: string; answer?: string };
type WheelConfig = { label: string; icon: LucideIcon; mode: WheelMode; items: WheelItem[] };
type WheelKey = 'culture' | 'actionTruth' | 'normal' | 'funny' | 'hot' | 'streamer' | 'custom';

const baseWheels: Record<WheelKey, WheelConfig> = {
  culture: {
    label: 'Culture G',
    icon: Brain,
    mode: 'quiz',
    items: [
      { text: 'Quelle est la capitale du Japon ?', answer: 'Tokyo' },
      { text: 'Combien y a-t-il de continents ?', answer: '7' },
      { text: 'Qui a peint La Joconde ?', answer: 'Leonard de Vinci' },
      { text: 'Quelle planete est surnommee la planete rouge ?', answer: 'Mars' },
      { text: 'Quel ocean est le plus grand ?', answer: 'Pacifique' },
      { text: 'En quelle annee a eu lieu la Revolution francaise ?', answer: '1789' },
      { text: 'Quel pays a gagne la Coupe du Monde 2018 ?', answer: 'France' },
      { text: 'Quel est le symbole chimique de l or ?', answer: 'Au' },
      { text: 'Combien font 12 x 12 ?', answer: '144' },
      { text: 'Qui a ecrit Les Miserables ?', answer: 'Victor Hugo' },
      { text: 'Quel animal est sur le logo de Twitter avant X ?', answer: 'Un oiseau' },
      { text: 'Quelle est la langue officielle du Bresil ?', answer: 'Portugais' },
    ],
  },
  actionTruth: {
    label: 'Action / Verite',
    icon: Heart,
    mode: 'prompt',
    items: [
      { text: 'Verite: raconte ton plus gros fou rire recent.' },
      { text: 'Action: laisse le chat choisir ton prochain message.' },
      { text: 'Verite: quel est ton red flag instantane ?' },
      { text: 'Action: fais une presentation dramatique de ton pseudo.' },
      { text: 'Verite: ton meilleur souvenir en live ?' },
      { text: 'Action: donne un compliment sincere a un membre.' },
      { text: 'Verite: quelle appli tu ouvres trop souvent ?' },
      { text: 'Action: invente une devise pour 100vvs.' },
    ],
  },
  normal: {
    label: 'Roue Normale',
    icon: Radio,
    mode: 'prompt',
    items: [
      { text: 'Question chat: quel sujet on lance maintenant ?' },
      { text: 'Defi simple: reponds sans utiliser la lettre A.' },
      { text: 'Choisis un membre pour une question.' },
      { text: 'Mini sondage: team nuit ou team matin ?' },
      { text: 'Interaction live: le chat choisit le prochain salon.' },
      { text: 'Bonus XP pour le prochain gagnant.' },
      { text: 'Pause profil: montre ton badge prefere.' },
      { text: 'Relance: fais tourner une autre roue.' },
    ],
  },
  funny: {
    label: 'Roue Drole',
    icon: Laugh,
    mode: 'prompt',
    items: [
      { text: 'Parle comme un commentateur sportif pendant 20 secondes.' },
      { text: 'Invente une excuse absurde pour etre en retard.' },
      { text: 'Fais une pub premium pour un objet inutile.' },
      { text: 'Le chat choisit un mot interdit pendant 2 minutes.' },
      { text: 'Raconte une histoire avec trois mots donnes par le chat.' },
      { text: 'Fais semblant de lancer une startup impossible.' },
      { text: 'Defi duo: deux membres inventent un slogan.' },
      { text: 'Rire interdit: lis le chat sans sourire.' },
    ],
  },
  hot: {
    label: 'Hot Soft',
    icon: Flame,
    mode: 'prompt',
    items: [
      { text: 'Red flag: ne jamais repondre pendant 24h.' },
      { text: 'Green flag: quelqu un qui respecte ton temps.' },
      { text: 'Crush celebrite du moment ?' },
      { text: 'Date ideal: chill maison ou sortie neon ?' },
      { text: 'Question fun: premier message parfait ?' },
      { text: 'Ton type en trois mots.' },
      { text: 'Le chat vote: red flag ou pas ?' },
      { text: 'Vibe check: quelle chanson pour un date ?' },
    ],
  },
  streamer: {
    label: 'Live Stream',
    icon: Mic2,
    mode: 'prompt',
    items: [
      { text: 'Le chat choisit le prochain mini-jeu.' },
      { text: 'Donne 100 XP symboliques a un viewer actif.' },
      { text: 'Fais une question rapide a tous les connectes.' },
      { text: 'Invite un membre a presenter son profil.' },
      { text: 'Lance un vote express oui/non.' },
      { text: 'Annonce un defi communautaire.' },
      { text: 'Reaction live: lis le dernier message avec energie.' },
      { text: 'Spin bonus: relance une roue au choix.' },
    ],
  },
  custom: {
    label: 'Vos Questions',
    icon: UserRound,
    mode: 'prompt',
    items: [
      { text: 'Ajoutez vos propres questions avec le panneau a droite.' },
      { text: 'Vous pouvez preparer une roue complete avant un live.' },
      { text: 'Chaque question ajoutee reste dans votre navigateur.' },
    ],
  },
};
const storageKey = '100vvs.customWheelItems';

export default function WheelsPage() {
  const [active, setActive] = useState<WheelKey>('culture');
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelItem>({ text: 'Pret pour le live.' });
  const [showAnswer, setShowAnswer] = useState(false);
  const [customItems, setCustomItems] = useState<Record<string, WheelItem[]>>({});
  const [customText, setCustomText] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');
  const [useOnlyCustom, setUseOnlyCustom] = useState(false);
  const colors = useMemo(() => ['#a855f7', '#6d28d9', '#22d3ee', '#ec4899', '#8b5cf6', '#111827', '#c084fc', '#312e81', '#0ea5e9', '#d946ef'], []);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) setCustomItems(JSON.parse(raw));
  }, []);

  const wheel = baseWheels[active];
  const ownItems = customItems[active] ?? [];
  const spinItems = useOnlyCustom && ownItems.length ? ownItems : [...wheel.items, ...ownItems];

  function persist(next: Record<string, WheelItem[]>) {
    setCustomItems(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function playSound() {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(300, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(920, context.currentTime + 0.18);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.55);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.58);
  }

  function spin(targetItems = spinItems) {
    if (!targetItems.length) return;
    playSound();
    setShowAnswer(false);
    const index = Math.floor(Math.random() * targetItems.length);
    const segment = 360 / targetItems.length;
    setRotation((current) => current + 1440 + index * segment + Math.random() * segment);
    window.setTimeout(() => setResult(targetItems[index]), 2600);
  }

  function noAnswer() {
    setActive('actionTruth');
    setResult({ text: 'Pas de reponse: passage automatique sur Action / Verite.' });
    setShowAnswer(false);
    window.setTimeout(() => spin([...baseWheels.actionTruth.items, ...(customItems.actionTruth ?? [])]), 250);
  }

  function addCustomItem() {
    const text = customText.trim();
    if (!text) return;
    const item: WheelItem = { text, answer: customAnswer.trim() || undefined };
    const next = { ...customItems, [active]: [...ownItems, item] };
    persist(next);
    setCustomText('');
    setCustomAnswer('');
  }

  function removeCustomItem(index: number) {
    const nextItems = ownItems.filter((_, itemIndex) => itemIndex !== index);
    persist({ ...customItems, [active]: nextItems });
  }

  return (
    <main className="min-h-screen px-5 py-6 md:px-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <BrandMark />
        <div className="flex gap-2">
          <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-wine">Accueil</Link>
          <Link href="/games" className="rounded-full bg-ruby px-5 py-2 text-sm font-semibold text-white shadow-glow">Jeux</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-8 py-8 xl:grid-cols-[1fr_420px] xl:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ruby/70">roues interactives live</p>
          <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-tight text-wine md:text-7xl">Culture G, Action Verite et roues custom pour tes lives.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/75">
            Si personne ne connait la reponse Culture G, clique sur Pas de reponse: la roue bascule automatiquement sur Action / Verite.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {(Object.keys(baseWheels) as WheelKey[]).map((key) => {
              const ItemIcon = baseWheels[key].icon;
              const customCount = customItems[key]?.length ?? 0;
              return (
                <button key={key} onClick={() => { setActive(key); setResult({ text: 'Pret pour le live.' }); setShowAnswer(false); }} className={`rounded-3xl border px-5 py-4 text-left ${active === key ? 'border-ruby/60 bg-ruby/20 shadow-glow' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'}`}>
                  <ItemIcon className="text-ruby" size={22} />
                  <p className="mt-3 font-semibold text-wine">{baseWheels[key].label}</p>
                  <p className="mt-1 text-xs text-ink/65">{baseWheels[key].items.length + customCount} segments live</p>
                </button>
              );
            })}
          </div>
        </div>

        <section className="glass-panel rounded-[36px] p-6 text-center">
          <div className="relative mx-auto grid aspect-square max-w-[360px] place-items-center">
            <div className="absolute -top-2 z-10 h-0 w-0 border-x-[14px] border-t-[26px] border-x-transparent border-t-white drop-shadow-[0_0_18px_rgba(168,85,247,.8)]" />
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1] }}
              className="neon-ring grid h-full w-full place-items-center rounded-full border border-white/20"
              style={{
                background: `conic-gradient(${spinItems.map((_, index) => `${colors[index % colors.length]} ${index * (360 / spinItems.length)}deg ${(index + 1) * (360 / spinItems.length)}deg`).join(', ')})`,
              }}
            >
              <div className="grid h-32 w-32 place-items-center rounded-full border border-white/20 bg-black/70 p-4 shadow-premium backdrop-blur">
                <Sparkles className="text-ruby" size={28} />
                <p className="mt-2 text-sm font-semibold text-wine">{wheel.label}</p>
              </div>
            </motion.div>
          </div>
          <div className="mt-6 rounded-3xl border border-ruby/25 bg-ruby/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ruby/80">resultat</p>
            <p className="mt-2 text-2xl font-semibold text-wine">{result.text}</p>
            {result.answer && (
              <div className="mt-4">
                <button onClick={() => setShowAnswer((value) => !value)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-wine">
                  {showAnswer ? 'Cacher la reponse' : 'Afficher la reponse'}
                </button>
                {showAnswer && <p className="mt-3 rounded-2xl bg-black/25 px-4 py-3 text-lg font-semibold text-ruby">{result.answer}</p>}
              </div>
            )}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button onClick={() => spin()} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#a855f7,#7c3aed,#22d3ee)] px-6 py-4 font-semibold text-white shadow-glow">
              <RotateCw size={19} /> Lancer <Volume2 size={18} />
            </button>
            <button onClick={noAnswer} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-wine hover:bg-ruby/15">
              Pas de reponse
            </button>
          </div>
        </section>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 pb-10 xl:grid-cols-[1fr_420px]">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {spinItems.map((item, index) => (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }} key={`${item.text}-${index}`} className="glass-panel rounded-3xl p-5">
              <p className="text-sm font-semibold text-ruby">Segment {index + 1}</p>
              <p className="mt-2 text-lg font-semibold text-wine">{item.text}</p>
              {item.answer && <p className="mt-2 text-sm text-ink/70">Reponse masquee</p>}
            </motion.div>
          ))}
        </section>

        <aside className="glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-2 text-wine">
            <ListPlus className="text-ruby" />
            <h2 className="text-xl font-semibold">Vos questions</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-ink/75">Oui, c est vous qui mettez les questions. Elles restent sauvegardees dans ce navigateur.</p>
          <label className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-wine">
            <input type="checkbox" checked={useOnlyCustom} onChange={(event) => setUseOnlyCustom(event.target.checked)} />
            Utiliser seulement vos questions
          </label>
          <textarea value={customText} onChange={(event) => setCustomText(event.target.value)} className="mt-4 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none" placeholder="Votre question, action, verite ou defi..." />
          <input value={customAnswer} onChange={(event) => setCustomAnswer(event.target.value)} className="mt-3 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none" placeholder="Reponse optionnelle pour Culture G" />
          <button onClick={addCustomItem} className="mt-3 w-full rounded-2xl bg-ruby px-5 py-3 font-semibold text-white shadow-glow">Ajouter a {wheel.label}</button>
          <div className="mt-5 space-y-2">
            {ownItems.map((item, index) => (
              <div key={`${item.text}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="min-w-0 flex-1 text-sm font-semibold text-wine">{item.text}</p>
                <button onClick={() => removeCustomItem(index)} className="rounded-xl bg-ruby/15 p-2 text-ruby" title="Supprimer"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

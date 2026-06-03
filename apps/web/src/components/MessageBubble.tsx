import { Heart, MoreHorizontal, Pin, Reply } from 'lucide-react';
import { motion } from 'framer-motion';

type Message = {
  id: string;
  body: string;
  imageUrl?: string;
  gifUrl?: string;
  isPinned?: boolean;
  author?: {
    username: string;
    role: string;
    profile?: { displayName: string; avatarUrl: string; nameColor: string; messageFrame: string };
  };
  reactions?: { emoji: string }[];
};

export function MessageBubble({ message }: { message: Message }) {
  const profile = message.author?.profile;
  const founder = message.author?.role === 'FOUNDER';
  return (
    <motion.article initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`rounded-3xl border bg-white/[0.05] p-4 shadow-sm backdrop-blur transition hover:bg-white/[0.08] hover:shadow-premium ${founder ? 'border-ruby/40 shadow-glow' : 'border-white/10'}`}>
      <div className="flex gap-3">
        <img src={profile?.avatarUrl ?? '/avatar-default.svg'} alt="" className="h-11 w-11 rounded-full bg-blush object-cover ring-2 ring-ruby/20" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold" style={{ color: profile?.nameColor ?? '#8f1327' }}>
              {profile?.displayName ?? message.author?.username ?? 'Anonyme'}
            </span>
            {founder && <span className="rounded-full bg-ruby px-2 py-0.5 text-[11px] font-semibold text-white shadow-glow">fondateur</span>}
            {message.isPinned && <Pin size={14} className="text-ruby" />}
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink/85">{message.body}</p>
          {message.imageUrl && <img src={message.imageUrl} alt="" className="mt-3 max-h-72 rounded-2xl object-cover" />}
          {message.gifUrl && <img src={message.gifUrl} alt="" className="mt-3 max-h-72 rounded-2xl object-cover" />}
          <div className="mt-3 flex items-center gap-2 text-ruby/80">
            <button className="rounded-full p-2 hover:bg-ruby/15" title="Repondre"><Reply size={16} /></button>
            <button className="rounded-full p-2 hover:bg-ruby/15" title="Reagir"><Heart size={16} /></button>
            <button className="rounded-full p-2 hover:bg-ruby/15" title="Options"><MoreHorizontal size={16} /></button>
            <div className="ml-1 flex gap-1 text-sm">{message.reactions?.map((reaction, index) => <span key={`${reaction.emoji}-${index}`}>{reaction.emoji}</span>)}</div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

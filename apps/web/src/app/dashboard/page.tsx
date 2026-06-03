'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Image, LogOut, Palette, Search, Send, Settings, Shield, Smile, Sparkles, UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { BrandMark } from '@/components/BrandMark';
import { MessageBubble } from '@/components/MessageBubble';
import { ProfileCard } from '@/components/ProfileCard';
import { api, getToken, readUser } from '@/lib/api';

type Channel = { id: string; slug: string; name: string; description: string };
type Message = Parameters<typeof MessageBubble>[0]['message'];
type Profile = {
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  status: string;
  nameColor: string;
  messageFrame: string;
  profileStyle: string;
  theme: string;
};
type Member = { id: string; username: string; role: string; profile: Profile | null };
type Friend = {
  id: string;
  requesterId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'BLOCKED';
  requester: Member;
  receiver: Member;
};
type Me = { id: string; username: string; role: string; createdAt: string; profile: Profile; badges: { badge: { key: string } }[] };
type Panel = 'profile' | 'friends' | 'customize';

const fallbackProfile: Profile = {
  displayName: '100vvs',
  avatarUrl: '/avatar-founder.svg',
  bannerUrl: '/banner-premium.svg',
  bio: 'Profil signature 100vvs.',
  status: 'Fondateur',
  nameColor: '#8f1327',
  messageFrame: 'founder',
  profileStyle: 'signature',
  theme: 'PREMIUM',
};

const themes = ['CLASSIC', 'CYBER', 'ELITE', 'OSINT', 'MINIMAL', 'PREMIUM'];
const colors = ['#c084fc', '#a855f7', '#7c3aed', '#22d3ee', '#ec4899', '#f7f2ff'];

export default function DashboardPage() {
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [me, setMe] = useState<Me | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [panel, setPanel] = useState<Panel>('profile');
  const [query, setQuery] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);

  const user = useMemo(readUser, []);
  const profile = me?.profile ?? fallbackProfile;

  async function refreshSocial() {
    const [nextMembers, nextFriends] = await Promise.all([api<Member[]>('/profiles'), api<Friend[]>('/friends')]);
    setMembers(nextMembers);
    setFriends(nextFriends);
  }

  async function refreshMe() {
    const nextMe = await api<Me>('/profiles/me');
    setMe(nextMe);
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/auth');
      return;
    }
    api<Channel[]>('/messages/channels')
      .then((data) => {
        setChannels(data);
        setActiveChannel(data[0]?.id ?? '');
        setApiError('');
      })
      .catch((error) => setApiError(error instanceof Error ? error.message : 'API indisponible'));
    refreshMe().catch(() => undefined);
    refreshSocial().catch(() => undefined);
  }, [router]);

  useEffect(() => {
    if (!activeChannel) return;
    api<Message[]>(`/messages/channels/${activeChannel}`).then(setMessages).catch(() => setMessages([]));
    socket?.emit('channel:join', activeChannel);
  }, [activeChannel, socket]);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const client = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000', { auth: { token } });
    client.on('message:new', (message: Message) => setMessages((current) => (current.some((item) => item.id === message.id) ? current : [...current, message])));
    setSocket(client);
    return () => {
      client.disconnect();
    };
  }, []);

  const visibleMembers = members.filter((member) => {
    if (member.id === me?.id) return false;
    const label = `${member.username} ${member.profile?.displayName ?? ''}`.toLowerCase();
    return label.includes(query.toLowerCase());
  });

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!body.trim() || !activeChannel) return;
    const payload = { channelId: activeChannel, body, imageUrl: imageUrl || undefined };
    if (socket?.connected) {
      let settled = false;
      socket.emit('message:create', payload, (created?: Message) => {
        settled = true;
        if (created?.id) setMessages((current) => (current.some((item) => item.id === created.id) ? current : [...current, created]));
      });
      window.setTimeout(async () => {
        if (settled) return;
        const created = await api<Message>('/messages', { method: 'POST', body: JSON.stringify(payload) });
        setMessages((current) => (current.some((item) => item.id === created.id) ? current : [...current, created]));
      }, 1800);
    } else {
      const created = await api<Message>('/messages', { method: 'POST', body: JSON.stringify(payload) });
      setMessages((current) => (current.some((item) => item.id === created.id) ? current : [...current, created]));
    }
    setBody('');
    setImageUrl('');
  }

  async function updateProfile(patch: Partial<Profile>) {
    setSaving(true);
    try {
      await api<Profile>('/profiles/me', { method: 'PATCH', body: JSON.stringify(patch) });
      await refreshMe();
    } finally {
      setSaving(false);
    }
  }

  async function addFriend(receiverId: string) {
    await api(`/friends/${receiverId}`, { method: 'POST' });
    await refreshSocial();
  }

  async function actOnFriend(id: string, action: 'accept' | 'refuse' | 'remove' | 'unblock') {
    const method = action === 'accept' ? 'PATCH' : 'DELETE';
    const suffix = action === 'remove' ? '' : `/${action}`;
    await api(`/friends/${id}${suffix}`, { method });
    await refreshSocial();
  }

  function logout() {
    localStorage.removeItem('100vvs.token');
    localStorage.removeItem('100vvs.user');
    router.replace('/auth');
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <div className="glass-panel rounded-[28px] p-7 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ruby/50">session requise</p>
          <h1 className="mt-2 text-2xl font-semibold text-wine">Redirection vers l'inscription</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-4 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 xl:grid-cols-[260px_1fr_360px]">
        <aside className="glass-panel rounded-[28px] p-5">
          <BrandMark />
          <div className="mt-8 space-y-2">
            {channels.map((channel) => (
              <button key={channel.id} onClick={() => setActiveChannel(channel.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${activeChannel === channel.id ? 'bg-ruby text-white shadow-premium' : 'text-wine hover:bg-blush'}`}>
                <Hash size={17} /> {channel.name}
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-2 text-sm text-ruby/70">
            {(user.role === 'ADMIN' || user.role === 'FOUNDER') && <a href="/admin" className="flex items-center gap-2 rounded-2xl px-4 py-3 hover:bg-ruby/15"><Shield size={17} /> Admin</a>}
            <a href="/games" className="flex items-center gap-2 rounded-2xl px-4 py-3 hover:bg-ruby/15"><Sparkles size={17} /> Jeux</a>
            <a href="/wheels" className="flex items-center gap-2 rounded-2xl px-4 py-3 hover:bg-ruby/15"><Palette size={17} /> Roues</a>
            <button onClick={() => setPanel('friends')} className="flex items-center gap-2 rounded-2xl px-4 py-3 text-left hover:bg-ruby/15"><Users size={17} /> Amis</button>
            <button onClick={() => setPanel('customize')} className="flex items-center gap-2 rounded-2xl px-4 py-3 text-left hover:bg-ruby/15"><Settings size={17} /> Personnalisation</button>
            <button onClick={logout} className="flex items-center gap-2 rounded-2xl px-4 py-3 text-left hover:bg-ruby/15"><LogOut size={17} /> Sortir</button>
          </div>
        </aside>

        <section className="glass-panel flex h-[calc(100vh-32px)] min-h-[720px] flex-col rounded-[28px] p-5">
          <div className="border-b border-petal/60 pb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ruby/50">salon public</p>
            <h1 className="mt-1 text-2xl font-semibold text-wine">{channels.find((channel) => channel.id === activeChannel)?.name ?? 'Discussion generale'}</h1>
            {apiError && <p className="mt-3 rounded-2xl bg-ruby px-4 py-3 text-sm text-white">API indisponible: lance le backend sur localhost:4000 ou utilise Docker Compose.</p>}
          </div>
          <div className="soft-scroll flex-1 space-y-3 overflow-y-auto py-5">
            {messages.length ? messages.map((message) => <MessageBubble key={message.id} message={message} />) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid h-full place-items-center text-center text-ink/60">
                <div>
                  <p className="text-lg font-semibold text-wine">Aucun message pour le moment</p>
                  <p className="mt-2 text-sm">Lance la conversation avec une presence sobre et nette.</p>
                </div>
              </motion.div>
            )}
          </div>
          <form onSubmit={send} className="rounded-3xl border border-white/10 bg-black/25 p-3 shadow-sm">
            <div className="flex gap-2">
              <input value={body} onChange={(event) => setBody(event.target.value)} className="min-w-0 flex-1 rounded-2xl bg-white/[0.04] px-4 py-3 outline-none" placeholder="Ecrire un message..." />
              <button type="button" className="rounded-2xl p-3 text-ruby hover:bg-ruby/15" title="Emoji"><Smile size={20} /></button>
              <button type="submit" className="rounded-2xl bg-ruby p-3 text-white hover:bg-wine" title="Envoyer"><Send size={20} /></button>
            </div>
            <div className="mt-2 flex items-center gap-2 px-1">
              <Image size={16} className="text-ruby/60" />
              <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="URL image ou GIF optionnelle" />
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <ProfileCard profile={profile} badges={me?.badges?.map((badge) => badge.badge.key) ?? ['verified', 'founder', 'premium']} />
          <div className="glass-panel rounded-[28px] p-5">
            <div className="grid grid-cols-3 rounded-2xl bg-black/25 p-1 text-sm font-semibold text-ruby/70">
              <button onClick={() => setPanel('profile')} className={`rounded-xl py-2 ${panel === 'profile' ? 'bg-ruby text-white shadow-glow' : ''}`}>Profil</button>
              <button onClick={() => setPanel('friends')} className={`rounded-xl py-2 ${panel === 'friends' ? 'bg-ruby text-white shadow-glow' : ''}`}>Amis</button>
              <button onClick={() => setPanel('customize')} className={`rounded-xl py-2 ${panel === 'customize' ? 'bg-ruby text-white shadow-glow' : ''}`}>Style</button>
            </div>
            {panel === 'profile' && <ProfilePanel profile={profile} saving={saving} onSave={updateProfile} />}
            {panel === 'friends' && <FriendsPanel meId={me?.id} friends={friends} members={visibleMembers} query={query} setQuery={setQuery} addFriend={addFriend} actOnFriend={actOnFriend} />}
            {panel === 'customize' && <CustomizePanel profile={profile} saving={saving} onSave={updateProfile} />}
          </div>
        </aside>
      </div>
    </main>
  );
}

function ProfilePanel({ profile, saving, onSave }: { profile: Profile; saving: boolean; onSave: (patch: Partial<Profile>) => Promise<void> }) {
  const [draft, setDraft] = useState(profile);

  useEffect(() => setDraft(profile), [profile]);

  return (
    <form onSubmit={(event) => { event.preventDefault(); void onSave(draft); }} className="mt-5 space-y-3">
      <Field label="Pseudo" value={draft.displayName} onChange={(value) => setDraft({ ...draft, displayName: value })} />
      <Field label="Statut" value={draft.status} onChange={(value) => setDraft({ ...draft, status: value })} />
      <label className="block">
        <span className="text-sm font-semibold text-wine">Bio</span>
        <textarea value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none focus:border-ruby" />
      </label>
      <button disabled={saving} className="w-full rounded-2xl bg-ruby px-4 py-3 text-sm font-semibold text-white shadow-premium disabled:opacity-60">Enregistrer le profil</button>
    </form>
  );
}

function FriendsPanel({ meId, friends, members, query, setQuery, addFriend, actOnFriend }: { meId?: string; friends: Friend[]; members: Member[]; query: string; setQuery: (value: string) => void; addFriend: (id: string) => Promise<void>; actOnFriend: (id: string, action: 'accept' | 'refuse' | 'remove' | 'unblock') => Promise<void> }) {
  return (
    <div className="mt-5 space-y-4">
      <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2">
        <Search size={16} className="text-ruby/60" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Chercher un membre" />
      </label>
      <div className="soft-scroll max-h-48 space-y-2 overflow-y-auto pr-1">
        {members.slice(0, 8).map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.04] p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-wine">{member.profile?.displayName ?? member.username}</p>
              <p className="text-xs text-ruby/60">{member.role}</p>
            </div>
            <button onClick={() => void addFriend(member.id)} className="rounded-xl bg-ruby p-2 text-white" title="Ajouter"><UserPlus size={16} /></button>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {friends.map((friend) => {
          const other = friend.requesterId === meId ? friend.receiver : friend.requester;
          const incoming = friend.receiverId === meId && friend.status === 'PENDING';
          return (
            <div key={friend.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-wine">{other.profile?.displayName ?? other.username}</p>
                <span className="text-xs font-semibold text-ruby/60">{friend.status}</span>
              </div>
              <div className="mt-3 flex gap-2">
                {incoming && <button onClick={() => void actOnFriend(friend.id, 'accept')} className="rounded-xl bg-ruby px-3 py-2 text-xs font-semibold text-white">Accepter</button>}
                {incoming && <button onClick={() => void actOnFriend(friend.id, 'refuse')} className="rounded-xl bg-ruby/15 px-3 py-2 text-xs font-semibold text-ruby">Refuser</button>}
                <button onClick={() => void actOnFriend(friend.id, friend.status === 'BLOCKED' ? 'unblock' : 'remove')} className="rounded-xl bg-white/[0.05] px-3 py-2 text-xs font-semibold text-ruby">{friend.status === 'BLOCKED' ? 'Debloquer' : 'Retirer'}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CustomizePanel({ profile, saving, onSave }: { profile: Profile; saving: boolean; onSave: (patch: Partial<Profile>) => Promise<void> }) {
  return (
    <div className="mt-5 space-y-5">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-wine"><Palette size={16} /> Couleur du pseudo</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {colors.map((color) => (
            <button key={color} onClick={() => void onSave({ nameColor: color })} className={`h-9 w-9 rounded-full border-2 ${profile.nameColor === color ? 'border-wine' : 'border-white'}`} style={{ backgroundColor: color }} title={color} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-wine">Theme du profil</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {themes.map((theme) => (
            <button key={theme} disabled={saving} onClick={() => void onSave({ theme })} className={`rounded-2xl px-3 py-3 text-sm font-semibold ${profile.theme === theme ? 'bg-ruby text-white' : 'bg-white/[0.04] text-ruby hover:bg-ruby/15'}`}>{theme}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-3">
        <Field label="Avatar" value={profile.avatarUrl} onChange={(value) => void onSave({ avatarUrl: value })} />
        <Field label="Banniere" value={profile.bannerUrl} onChange={(value) => void onSave({ bannerUrl: value })} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-wine">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none focus:border-ruby" />
    </label>
  );
}

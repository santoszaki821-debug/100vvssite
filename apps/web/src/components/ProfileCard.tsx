import { BadgeCheck, Crown, Gem, Sparkles } from 'lucide-react';

type Profile = {
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  status: string;
  nameColor: string;
  theme: string;
};

const badgeIcons = {
  verified: BadgeCheck,
  founder: Crown,
  premium: Gem,
  member: Sparkles,
};

export function ProfileCard({ profile, badges = ['verified', 'founder', 'premium'] }: { profile: Profile; badges?: string[] }) {
  return (
    <section className="glass-panel overflow-hidden rounded-[28px]">
      <div className="h-28 bg-[linear-gradient(135deg,#05040a,#6d28d9,#22d3ee)]" />
      <div className="px-6 pb-6">
        <div className="-mt-12 flex items-end justify-between">
          <img src={profile.avatarUrl} alt="" className="h-24 w-24 rounded-full border-4 border-[#100b20] bg-blush object-cover shadow-glow" />
          <span className="rounded-full border border-ruby/30 bg-ruby/15 px-4 py-2 text-sm font-medium text-ruby">{profile.theme}</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <h2 className="text-2xl font-semibold" style={{ color: profile.nameColor }}>
            {profile.displayName}
          </h2>
          <BadgeCheck className="text-blue-500" size={20} />
        </div>
        <p className="mt-1 text-sm font-medium text-ruby">{profile.status}</p>
        <p className="mt-4 min-h-12 text-sm leading-6 text-ink/75">{profile.bio || 'Bio elegante, anonyme et personnelle.'}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {badges.map((badge) => {
            const Icon = badgeIcons[badge as keyof typeof badgeIcons] ?? Sparkles;
            return (
              <span key={badge} className="inline-flex items-center gap-2 rounded-full border border-ruby/25 bg-ruby/10 px-3 py-1.5 text-xs font-semibold text-ruby">
                <Icon size={14} /> {badge}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

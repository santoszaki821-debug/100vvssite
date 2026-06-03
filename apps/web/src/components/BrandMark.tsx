import { BadgeCheck, Crown } from 'lucide-react';

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,#a855f7,#6d28d9,#22d3ee)] text-white shadow-glow">
        <Crown size={20} />
      </div>
      <div>
        <div className="flex items-center gap-2 text-xl font-semibold text-wine">
          100vvs <BadgeCheck size={18} className="text-blue-500" />
        </div>
        <p className="text-xs uppercase tracking-[0.18em] text-ruby/70">next-gen community</p>
      </div>
    </div>
  );
}

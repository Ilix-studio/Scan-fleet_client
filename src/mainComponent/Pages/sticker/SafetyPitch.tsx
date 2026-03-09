// SafetyPitch.tsx
// Emotional safety pitch — role-personalized, fear-first, solution-second
// Integrates as a section above the TokenDisplay/WalletDisplay CTA

import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  PhoneCall,
  QrCode,
  Heart,
  ChevronDown,
} from "lucide-react";

type UserRole =
  | "DEALERSHIP_OWNER"
  | "DEALERSHIP_SALESMAN"
  | "RENTAL_OWNER"
  | "DIRECT_CUSTOMER";

// ── Role-personalized pitch copy ──────────────────────────────────────────────
const ROLE_PITCH: Record<
  UserRole,
  {
    opener: string;
    stat: string;
    statSub: string;
    fear: string;
    scenario: string;
    pivot: string;
  }
> = {
  DEALERSHIP_OWNER: {
    opener: "Every car you sell has left your lot.",
    stat: "1 in 4",
    statSub: "Indian drivers will be in a serious accident in their lifetime",
    fear: "Your customer drives home today. Tonight, their car is upside down on NH-44. They're unconscious. Their phone is shattered. Bystanders are standing around — no one knows who to call.",
    scenario:
      "That silence — those wasted minutes — is what kills people. Not the crash. The delay.",
    pivot:
      "You sold them the car. You can also give them the one thing that speaks for them when they can't.",
  },
  DEALERSHIP_SALESMAN: {
    opener: "You hand over the keys every single day.",
    stat: "18 minutes",
    statSub: "average time for family to be notified after a road accident",
    fear: "Think about the last customer you helped. They drove off smiling. If something happened to them tonight — a truck, a pothole, a moment of distraction — would anyone at the scene know who they are? Who to call?",
    scenario:
      "Strangers photograph the wreck. Someone calls 112. The family waits by the phone, knowing nothing.",
    pivot:
      "One sticker on the windshield changes all of this. And you're the one who can make sure it's there.",
  },
  RENTAL_OWNER: {
    opener: "Strangers drive your vehicles every day.",
    stat: "74%",
    statSub:
      "of road fatalities involve vehicles where bystanders had no emergency contact",
    fear: "A tourist rents your car. They don't know the roads. They go off a hill road. When help arrives, no one in the car has local contacts. The car is registered to your business. Hours pass before anyone is notified.",
    scenario: "Your vehicle. A stranger's life. Zero information at the scene.",
    pivot:
      "Each rental that leaves your lot is a liability — and an opportunity to do something about it.",
  },
  DIRECT_CUSTOMER: {
    opener: "You carry your phone everywhere.",
    stat: "But phones get thrown 40 feet in a collision.",
    statSub: "screens shatter, batteries die, pockets are empty",
    fear: "You're driving back from work. A truck jumps the divider. You're unconscious. Your phone is somewhere on the road, cracked and dark. The people rushing to help — they have no idea who you are, who loves you, who needs to know.",
    scenario:
      "Your family is home. Unaware. Every minute that passes is a minute they could have been there.",
    pivot: "This is not a sticker. It's a voice for you when you can't speak.",
  },
};

// ── Belief pillars — same across roles ────────────────────────────────────────
const BELIEFS = [
  {
    icon: AlertTriangle,
    headline: "Accidents don't announce themselves.",
    body: "India records a road accident every 3 minutes. More than 1.5 lakh people die every year — most of them in the golden hour, waiting for someone to find the right phone number.",
    color: "amber",
  },
  {
    icon: QrCode,
    headline: "A scan takes 4 seconds.",
    body: "Any bystander, any phone, no app needed. One scan and emergency contacts are on the screen — with a masked call button ready to go. The sticker works when your phone doesn't.",
    color: "cyan",
  },
  {
    icon: PhoneCall,
    headline: "Family contact changes outcomes.",
    body: "Studies show that rapid family notification reduces critical care delays by 40%. The difference between a family that arrives in 10 minutes versus 2 hours is a piece of information — and this sticker carries it.",
    color: "purple",
  },
  {
    icon: Heart,
    headline: "The people who love you can't help if they don't know.",
    body: "Nobody plans to be in an accident. But the people who survive them — and the families who stay whole — are the ones who were prepared. This is what preparation looks like.",
    color: "pink",
  },
];

const COLOR_MAP: Record<
  string,
  { text: string; bg: string; border: string; glow: string }
> = {
  amber: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "rgba(245,158,11,0.15)",
  },
  cyan: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "rgba(6,182,212,0.15)",
  },
  purple: {
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    glow: "rgba(168,85,247,0.15)",
  },
  pink: {
    text: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    glow: "rgba(236,72,153,0.15)",
  },
};

// ── Hook: intersection observer for fade-in ───────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatPulse({ stat, sub }: { stat: string; sub: string }) {
  return (
    <div className='relative flex flex-col items-center justify-center py-16'>
      {/* Pulsing ring */}
      <span
        className='absolute w-64 h-64 rounded-full opacity-20 animate-ping'
        style={{
          background:
            "radial-gradient(circle, rgba(239,68,68,0.4), transparent 70%)",
          animationDuration: "2.5s",
        }}
      />
      <span
        className='absolute w-48 h-48 rounded-full opacity-10'
        style={{
          background:
            "radial-gradient(circle, rgba(239,68,68,0.6), transparent 70%)",
        }}
      />
      <p
        className='relative text-6xl sm:text-8xl font-black tracking-tighter text-white'
        style={{
          fontFamily: "'Syne', sans-serif",
          textShadow: "0 0 60px rgba(239,68,68,0.5)",
        }}
      >
        {stat}
      </p>
      <p className='relative mt-3 text-sm sm:text-base text-red-300/80 text-center max-w-xs leading-snug'>
        {sub}
      </p>
    </div>
  );
}

function FearBlock({
  fear,
  scenario,
  pivot,
}: {
  fear: string;
  scenario: string;
  pivot: string;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className='transition-all duration-700'
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
      }}
    >
      {/* Red rule */}
      <div className='w-12 h-0.5 bg-red-500 mb-6' />
      <p
        className='text-lg sm:text-xl text-white/90 leading-relaxed mb-4'
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        {fear}
      </p>
      <p className='text-base text-red-400/80 font-medium italic mb-6'>
        {scenario}
      </p>
      <p className='text-base text-white/60 leading-relaxed border-l-2 border-white/20 pl-4'>
        {pivot}
      </p>
    </div>
  );
}

function BeliefCard({
  icon: Icon,
  headline,
  body,
  color,
}: (typeof BELIEFS)[number]) {
  const { ref, visible } = useFadeIn();
  const c = COLOR_MAP[color];
  return (
    <div
      ref={ref}
      className={`relative rounded-2xl border ${c.border} p-6 transition-all duration-700 overflow-hidden`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        background: `radial-gradient(ellipse 80% 60% at 0% 0%, ${c.glow}, transparent 60%), rgba(255,255,255,0.02)`,
      }}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${c.bg} border ${c.border}`}
      >
        <Icon size={18} className={c.text} />
      </div>
      <h3
        className={`font-bold text-base mb-2 ${c.text}`}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {headline}
      </h3>
      <p className='text-sm text-white/55 leading-relaxed'>{body}</p>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
interface SafetyPitchProps {
  role?: UserRole;
}

export default function SafetyPitch({
  role = "DIRECT_CUSTOMER",
}: SafetyPitchProps) {
  const pitch = ROLE_PITCH[role];
  const { ref: heroRef, visible: heroVisible } = useFadeIn();

  return (
    <div
      className='relative w-full bg-[#06060c] overflow-hidden'
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:.85} 95%{opacity:.6} 97%{opacity:.9} }
        .text-flicker { animation: flicker 6s infinite; }
      `}</style>

      {/* ── Hero: Opener ── */}
      <div className='relative min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center'>
        {/* Ambient red threat glow */}
        <div
          className='absolute inset-0 pointer-events-none'
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(220,38,38,0.07), transparent 70%)",
          }}
        />
        {/* Grain overlay */}
        <div
          className='absolute inset-0 opacity-[0.04] pointer-events-none'
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />

        <div
          ref={heroRef}
          className='relative z-10 max-w-3xl transition-all duration-1000'
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "none" : "translateY(32px)",
          }}
        >
          <p className='text-red-500/80 text-sm font-semibold tracking-[0.2em] uppercase mb-6 text-flicker'>
            ⚠ Road Safety Reality
          </p>

          <h1
            className='text-4xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight mb-8'
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {pitch.opener}
          </h1>

          <StatPulse stat={pitch.stat} sub={pitch.statSub} />

          <FearBlock
            fear={pitch.fear}
            scenario={pitch.scenario}
            pivot={pitch.pivot}
          />
        </div>

        {/* Scroll cue */}
        <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30'>
          <ChevronDown size={16} className='text-white animate-bounce' />
        </div>
      </div>

      {/* ── Divider ── */}
      <div
        className='relative h-px mx-8'
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)",
        }}
      />

      {/* ── 4 Belief pillars ── */}
      <div className='px-6 py-16 max-w-5xl mx-auto'>
        <p className='text-xs text-white/30 uppercase tracking-[0.25em] text-center mb-10'>
          Why this works
        </p>
        <div className='grid sm:grid-cols-2 gap-4'>
          {BELIEFS.map((b) => (
            <BeliefCard key={b.headline} {...b} />
          ))}
        </div>
      </div>

      {/* ── Transition into TokenDisplay ── */}
      <div
        className='relative px-6 py-14 text-center'
        style={{ background: "linear-gradient(to bottom, #06060c, #080810)" }}
      >
        <div
          className='absolute inset-0 pointer-events-none'
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(6,182,212,0.06), transparent 70%)",
          }}
        />
        <p
          className='relative text-2xl sm:text-3xl font-black text-white max-w-lg mx-auto leading-snug mb-3'
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          A sticker that costs less than a cup of coffee.
        </p>
        <p className='relative text-white/40 text-sm max-w-sm mx-auto'>
          Buy tokens. Activate stickers. Give your customers — or yourself — a
          voice when it matters most.
        </p>
        {/* Arrow bridge into TokenDisplay */}
        <div className='relative mt-10 flex justify-center'>
          <div className='w-px h-12 bg-gradient-to-b from-transparent via-cyan-500/40 to-cyan-500/80' />
        </div>
      </div>
    </div>
  );
}

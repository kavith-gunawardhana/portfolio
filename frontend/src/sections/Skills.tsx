import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { Skill, SkillCategory } from "../types";

const TIERS = [
  { min: 85, label: "master",     color: "text-cyber-cyan",   fill: "#22d3ee", glow: "rgba(34,211,238,0.55)" },
  { min: 70, label: "proficient", color: "text-cyber-violet", fill: "#a78bfa", glow: "rgba(167,139,250,0.55)" },
  { min: 50, label: "competent",  color: "text-cyber-green",  fill: "#34d399", glow: "rgba(52,211,153,0.45)" },
  { min: 0,  label: "learning",   color: "text-cyber-yellow", fill: "#fde047", glow: "rgba(253,224,71,0.45)" },
] as const;

type Tier = (typeof TIERS)[number];

function tierFor(level: number): Tier {
  return TIERS.find((t) => level >= t.min) ?? TIERS[TIERS.length - 1];
}

// Higher level → closer to the bullseye. Range stays inside the radar disc.
function levelToRadius(level: number): number {
  const clamped = Math.min(Math.max(level, 0), 100);
  return (1 - clamped / 100) * 78 + 14;
}

function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) };
}

function Radar({ category, sweepDur }: { category: SkillCategory; sweepDur: number }) {
  const [hoverId, setHoverId] = useState<number | null>(null);
  const skills = category.skills;
  const total = skills.length;
  const seed = category.id * 13 + (category.name.length || 1);

  const blips = useMemo(
    () =>
      skills.map((s: Skill, i: number) => {
        const tier = tierFor(s.level);
        const base = (i / Math.max(total, 1)) * 360;
        const angle = (base + (seed * 47) % 360 + (s.id * 37) % 23) % 360;
        const radius = levelToRadius(s.level);
        const { x, y } = polar(angle, radius);
        return { skill: s, tier, x, y, angle, radius };
      }),
    [skills, total, seed],
  );

  if (total === 0) {
    return (
      <div className="py-12 text-center text-xs text-slate-500 font-mono">// no contacts on radar</div>
    );
  }

  const ringRadii = [levelToRadius(85), levelToRadius(70), levelToRadius(50), 92];

  return (
    <div className="relative">
      <svg viewBox="-110 -110 220 220" className="w-full max-w-[280px] mx-auto block">
        <defs>
          <radialGradient id={`bg-${category.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.10)" />
            <stop offset="65%" stopColor="rgba(34,211,238,0.03)" />
            <stop offset="100%" stopColor="rgba(2,6,23,0)" />
          </radialGradient>
          <linearGradient
            id={`sweep-${category.id}`}
            x1="0"
            y1="0"
            x2="0"
            y2="-92"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="rgba(34,211,238,0)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0.45)" />
          </linearGradient>
          <radialGradient id={`vignette-${category.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="rgba(2,6,23,0)" />
            <stop offset="100%" stopColor="rgba(2,6,23,0.7)" />
          </radialGradient>
        </defs>

        <circle r="95" fill={`url(#bg-${category.id})`} />

        {ringRadii.map((r, i) => (
          <circle
            key={i}
            r={r}
            fill="none"
            stroke="rgba(148,163,184,0.18)"
            strokeWidth={i === 3 ? 1 : 0.5}
            strokeDasharray={i === 3 ? undefined : "2 3"}
          />
        ))}

        <line x1="-92" y1="0" x2="92" y2="0" stroke="rgba(148,163,184,0.12)" strokeWidth="0.5" />
        <line x1="0" y1="-92" x2="0" y2="92" stroke="rgba(148,163,184,0.12)" strokeWidth="0.5" />

        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: sweepDur, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0px 0px" }}
        >
          <path
            d="M 0,0 L 0,-92 A 92 92 0 0 1 79.67,-46 Z"
            fill={`url(#sweep-${category.id})`}
          />
          <line x1="0" y1="0" x2="0" y2="-92" stroke="rgba(34,211,238,0.85)" strokeWidth="1" />
        </motion.g>

        <circle r="6" fill="rgba(34,211,238,0.18)" />
        <circle r="2" fill="#22d3ee" />

        {blips.map(({ skill, tier, x, y }, i) => {
          const isHover = hoverId === skill.id;
          return (
            <g key={skill.id} transform={`translate(${x.toFixed(2)},${y.toFixed(2)})`}>
              <motion.circle
                fill={tier.fill}
                opacity={0.18}
                animate={{
                  r: isHover ? [10, 18, 10] : [5, 9, 5],
                  opacity: isHover ? [0.25, 0.45, 0.25] : [0.08, 0.22, 0.08],
                }}
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
              />
              <motion.circle
                r={isHover ? 4.2 : 3}
                fill={tier.fill}
                stroke="#0b1020"
                strokeWidth="0.6"
                style={{ filter: `drop-shadow(0 0 4px ${tier.glow})`, cursor: "pointer" }}
                onMouseEnter={() => setHoverId(skill.id)}
                onMouseLeave={() => setHoverId(null)}
                whileHover={{ scale: 1.4 }}
              />
              <title>{`${skill.name} — ${tier.label} (${skill.level})`}</title>
            </g>
          );
        })}

        <circle r="100" fill={`url(#vignette-${category.id})`} pointerEvents="none" />
      </svg>

      <ul className="mt-3 space-y-1">
        {blips.map(({ skill, tier }) => {
          const isHover = hoverId === skill.id;
          return (
            <li
              key={skill.id}
              onMouseEnter={() => setHoverId(skill.id)}
              onMouseLeave={() => setHoverId(null)}
              className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-mono transition cursor-default ${
                isHover ? "bg-bg/60" : ""
              }`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ background: tier.fill, boxShadow: `0 0 6px ${tier.glow}` }}
              />
              {skill.icon && <span className="text-sm shrink-0">{skill.icon}</span>}
              <span className="truncate text-slate-200">{skill.name}</span>
              <span
                className={`ml-auto text-[10px] uppercase tracking-wider shrink-0 ${tier.color}`}
              >
                {tier.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Skills({ categories }: { categories: SkillCategory[] }) {
  if (!categories.length) return null;
  // Per-card sweep duration spread so radars don't all rotate in lock-step.
  const sweepDurs = [5.5, 6.2, 6.8, 7.4];
  return (
    <section id="skills" className="py-20 relative">
      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="02 // skills"
          title="./skills --radar"
          subtitle="Threat-radar of my current toolkit. Distance from center = depth (closer is sharper). Hover any blip."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="card p-5 relative overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-3">
                {cat.icon && <span className="text-xl">{cat.icon}</span>}
                <h3 className="font-mono text-cyber-cyan text-sm uppercase tracking-wider truncate">
                  {cat.name}
                </h3>
                <span className="ml-auto text-[10px] text-slate-500 font-mono shrink-0">
                  {cat.skills.length} contact{cat.skills.length === 1 ? "" : "s"}
                </span>
              </div>
              <Radar category={cat} sweepDur={sweepDurs[idx % sweepDurs.length]} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 justify-center text-[11px] font-mono text-slate-400">
          <span className="text-slate-500">$ legend:</span>
          {TIERS.map((t) => (
            <span key={t.label} className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: t.fill, boxShadow: `0 0 6px ${t.glow}` }}
              />
              <span className={t.color}>{t.label}</span>
              <span className="text-slate-600">
                {t.label === "master" ? "≥85" : t.label === "proficient" ? "≥70" : t.label === "competent" ? "≥50" : "<50"}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

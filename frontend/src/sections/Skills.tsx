import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { Skill, SkillCategory } from "../types";

const TIERS = [
  { min: 85, label: "MASTER", color: "text-cyber-cyan", hoverBorder: "hover:border-cyber-cyan/50", fill: "#22d3ee" },
  { min: 70, label: "PROFICIENT", color: "text-cyber-violet", hoverBorder: "hover:border-cyber-violet/50", fill: "#a78bfa" },
  { min: 50, label: "COMPETENT", color: "text-cyber-green", hoverBorder: "hover:border-cyber-green/40", fill: "#34d399" },
  { min: 0, label: "LEARNING", color: "text-cyber-yellow", hoverBorder: "hover:border-cyber-yellow/40", fill: "#fde047" },
] as const;

type Tier = (typeof TIERS)[number];

function tierFor(level: number): Tier {
  return TIERS.find((t) => level >= t.min) ?? TIERS[TIERS.length - 1];
}

const TILES = 8;

function HexTiles({ level, tier }: { level: number; tier: Tier }) {
  const filled = Math.round((Math.min(Math.max(level, 0), 100) / 100) * TILES);
  return (
    <div className="flex gap-[3px]" aria-label={`level ${level} of 100`}>
      {Array.from({ length: TILES }).map((_, i) => {
        const isFilled = i < filled;
        return (
          <motion.span
            key={i}
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            className="block w-2.5 h-3.5"
            style={{
              clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
              background: isFilled ? tier.fill : "rgba(148, 163, 184, 0.18)",
              boxShadow: isFilled ? `0 0 6px ${tier.fill}AA` : "none",
            }}
          />
        );
      })}
    </div>
  );
}

function SkillRow({ skill, idx }: { skill: Skill; idx: number }) {
  const tier = tierFor(skill.level);
  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: idx * 0.04 }}
      className={`group relative px-3 py-2 -mx-1 rounded-md border border-transparent hover:bg-bg/40 ${tier.hoverBorder} transition`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-slate-200 text-sm flex items-center gap-2 min-w-0">
          {skill.icon && <span className="text-base shrink-0">{skill.icon}</span>}
          <span className="truncate group-hover:text-white transition">{skill.name}</span>
        </span>
        <span className={`font-mono text-[10px] tracking-wider ${tier.color} shrink-0`}>
          {tier.label}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <HexTiles level={skill.level} tier={tier} />
        <span className="font-mono text-[10px] text-slate-500 tabular-nums">
          {String(skill.level).padStart(3, "0")}/100
        </span>
      </div>
    </motion.li>
  );
}

export default function Skills({ categories }: { categories: SkillCategory[] }) {
  if (!categories.length) return null;
  return (
    <section id="skills" className="py-20 relative">
      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="02 // skills"
          title="./skills --list"
          subtitle="A snapshot of my current toolkit. Tier reflects depth, not days spent."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="card p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                {cat.icon && <span className="text-xl">{cat.icon}</span>}
                <h3 className="font-mono text-cyber-cyan text-sm uppercase tracking-wider">
                  {cat.name}
                </h3>
                <span className="ml-auto text-[10px] text-slate-500 font-mono">
                  {cat.skills.length} module{cat.skills.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="border-t border-dashed border-bg-border/60 mb-1" />
              <ul className="space-y-1">
                {cat.skills.map((s, i) => (
                  <SkillRow key={s.id} skill={s} idx={i} />
                ))}
                {cat.skills.length === 0 && (
                  <li className="text-xs text-slate-500 font-mono py-2">// no skills yet</li>
                )}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-center font-mono text-[11px] text-slate-500">
          <span className="text-cyber-cyan">$</span> tier_legend{" "}
          <span className="text-cyber-cyan">MASTER</span>{" \u00b7 "}
          <span className="text-cyber-violet">PROFICIENT</span>{" \u00b7 "}
          <span className="text-cyber-green">COMPETENT</span>{" \u00b7 "}
          <span className="text-cyber-yellow">LEARNING</span>
        </div>
      </div>
    </section>
  );
}

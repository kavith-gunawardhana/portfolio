import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { Skill, SkillCategory } from "../types";

const TIERS = [
  {
    min: 85,
    label: "master",
    text: "text-cyber-cyan",
    border: "border-cyber-cyan/40 hover:border-cyber-cyan",
    dot: "bg-cyber-cyan",
  },
  {
    min: 70,
    label: "proficient",
    text: "text-cyber-violet",
    border: "border-cyber-violet/35 hover:border-cyber-violet",
    dot: "bg-cyber-violet",
  },
  {
    min: 50,
    label: "competent",
    text: "text-cyber-green",
    border: "border-cyber-green/30 hover:border-cyber-green",
    dot: "bg-cyber-green",
  },
  {
    min: 0,
    label: "learning",
    text: "text-cyber-yellow",
    border: "border-cyber-yellow/30 hover:border-cyber-yellow",
    dot: "bg-cyber-yellow",
  },
] as const;

type Tier = (typeof TIERS)[number];

function tierFor(level: number): Tier {
  return TIERS.find((t) => level >= t.min) ?? TIERS[TIERS.length - 1];
}

function SkillChip({ skill, idx }: { skill: Skill; idx: number }) {
  const tier = tierFor(skill.level);
  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: idx * 0.025 }}
      className={`inline-flex items-center gap-2 rounded-full border ${tier.border} bg-bg/30 px-3 py-1.5 font-mono text-[12px] text-slate-200 transition-colors hover:bg-bg/60 hover:text-white`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${tier.dot}`} />
      {skill.icon && <span className="text-sm leading-none">{skill.icon}</span>}
      <span>{skill.name}</span>
    </motion.span>
  );
}

function CategoryBlock({ category, idx }: { category: SkillCategory; idx: number }) {
  const sorted = [...category.skills].sort((a, b) => b.level - a.level);
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: idx * 0.06 }}
      className="space-y-4"
    >
      <header className="flex items-baseline gap-3">
        {category.icon && (
          <span aria-hidden="true" className="text-base leading-none">
            {category.icon}
          </span>
        )}
        <h3 className="font-mono text-[13px] uppercase tracking-[0.18em] text-slate-100">
          {category.name}
        </h3>
        <span className="text-[11px] font-mono text-slate-500">
          {String(category.skills.length).padStart(2, "0")}
        </span>
        <div className="ml-2 flex-1 border-t border-bg-border/70" />
      </header>
      {sorted.length === 0 ? (
        <p className="text-xs font-mono text-slate-500">// no skills yet</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sorted.map((s, i) => (
            <SkillChip key={s.id} skill={s} idx={i} />
          ))}
        </div>
      )}
    </motion.section>
  );
}

export default function Skills({ categories }: { categories: SkillCategory[] }) {
  if (!categories.length) return null;
  return (
    <section id="skills" className="py-20 relative">
      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="02 // skills"
          title="./skills"
          subtitle="Tools and toolkits I work with. Sorted by depth within each group."
        />
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-14">
          {categories.map((cat, idx) => (
            <CategoryBlock key={cat.id} category={cat} idx={idx} />
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] text-slate-400">
          <span className="text-slate-500">$ legend:</span>
          {TIERS.map((t) => (
            <span key={t.label} className="inline-flex items-center gap-2">
              <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
              <span className={t.text}>{t.label}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { useMemo } from "react";
import SectionHeader from "../components/SectionHeader";
import { Skill, SkillCategory } from "../types";

const TIERS = [
  {
    min: 85,
    label: "master",
    color: "text-cyber-cyan",
    glow: "rgba(34,211,238,0.45)",
    mode: "drwxr-xr-x",
    suffix: "*",
  },
  {
    min: 70,
    label: "proficient",
    color: "text-cyber-violet",
    glow: "rgba(167,139,250,0.45)",
    mode: "-rwxr-xr-x",
    suffix: "*",
  },
  {
    min: 50,
    label: "competent",
    color: "text-cyber-green",
    glow: "rgba(52,211,153,0.4)",
    mode: "-rwxr-x---",
    suffix: "",
  },
  {
    min: 0,
    label: "learning",
    color: "text-cyber-yellow",
    glow: "rgba(253,224,71,0.4)",
    mode: "-rw-------",
    suffix: "",
  },
] as const;

type Tier = (typeof TIERS)[number];

function tierFor(level: number): Tier {
  return TIERS.find((t) => level >= t.min) ?? TIERS[TIERS.length - 1];
}

function humanSize(level: number): string {
  // Map level to a believable file size. Higher level = "denser file".
  const bytes = Math.round(120 + level * 42 + Math.pow(level, 1.4));
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + "K";
  return bytes + "B";
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function fakeMtime(skill: Skill): string {
  // Deterministic per-skill "last touched" stamp — higher level skills look more recently
  // touched. We seed off id + level so it's stable across renders but varies between rows.
  const now = new Date();
  const daysAgo = Math.max(
    0,
    Math.round((100 - skill.level) * 1.4 + ((skill.id * 31) % 18))
  );
  const d = new Date(now.getTime() - daysAgo * 86400000);
  const mm = MONTHS[d.getMonth()];
  const dd = String(d.getDate()).padStart(2, " ");
  if (daysAgo > 180) {
    return `${mm} ${dd}  ${d.getFullYear()}`;
  }
  const hh = String(((skill.id * 7 + skill.level) % 24)).padStart(2, "0");
  const mi = String(((skill.id * 13 + skill.level * 3) % 60)).padStart(2, "0");
  return `${mm} ${dd} ${hh}:${mi}`;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 18);
}

function SkillRow({ skill, idx }: { skill: Skill; idx: number }) {
  const tier = tierFor(skill.level);
  const size = humanSize(skill.level);
  const mtime = fakeMtime(skill);
  const slug = slugify(skill.name);

  return (
    <motion.li
      initial={{ opacity: 0, x: -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: idx * 0.035, ease: "easeOut" }}
      className="group relative font-mono text-[12px] leading-[1.55] tracking-tight whitespace-pre text-slate-400 hover:text-slate-200 hover:bg-cyber-cyan/[0.04] rounded px-2 -mx-2 transition-colors cursor-default"
      title={`${skill.name} — ${tier.label}`}
    >
      <span className="text-slate-500">{tier.mode}</span>
      <span>  </span>
      <span className="text-slate-500">1</span>
      <span> </span>
      <span className="text-slate-500">kavith</span>
      <span> </span>
      <span className={`${tier.color}`}>{tier.label.padEnd(10, " ")}</span>
      <span> </span>
      <span className="text-slate-500 tabular-nums">{size.padStart(5, " ")}</span>
      <span>  </span>
      <span className="text-slate-500">{mtime.padEnd(12, " ")}</span>
      <span>  </span>
      <span className={`${tier.color} group-hover:[text-shadow:0_0_8px_var(--tier-glow)]`}
        style={{ ["--tier-glow" as string]: tier.glow }}>
        {skill.icon ? `${skill.icon} ` : ""}{slug}
        <span className="text-slate-500">{tier.suffix}</span>
      </span>
    </motion.li>
  );
}

function CategoryBlock({ cat, idx }: { cat: SkillCategory; idx: number }) {
  const totalK = useMemo(() => {
    const totalBytes = cat.skills.reduce(
      (s, sk) => s + 120 + sk.level * 42 + Math.pow(sk.level, 1.4),
      0
    );
    return totalBytes >= 1024 ? (totalBytes / 1024).toFixed(1) + "K" : Math.round(totalBytes) + "B";
  }, [cat.skills]);

  const dirSlug = useMemo(() => slugify(cat.name) || "skills", [cat.name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: idx * 0.06 }}
      className="card p-5 overflow-hidden"
    >
      {/* prompt header */}
      <div className="font-mono text-[12px] mb-3 select-none">
        <span className="text-cyber-green">kavith@portfolio</span>
        <span className="text-slate-500">:</span>
        <span className="text-cyber-cyan">~/skills/{dirSlug}</span>
        <span className="text-slate-500">$ </span>
        <span className="text-slate-200">ls -lah</span>
        <span className="ml-1 inline-block w-[7px] h-[12px] align-[-2px] bg-cyber-cyan animate-pulse" />
      </div>

      {/* category meta */}
      <div className="font-mono text-[11px] text-slate-500 mb-2 flex items-center gap-2">
        <span>
          total <span className="text-slate-300">{totalK}</span>
        </span>
        <span className="text-bg-border">·</span>
        {cat.icon && <span>{cat.icon}</span>}
        <span className="text-cyber-cyan/80 uppercase tracking-wider">{cat.name}</span>
      </div>

      <div className="border-t border-dashed border-bg-border/60 mb-2" />

      <ul className="space-y-[1px]">
        {cat.skills.map((s, i) => (
          <SkillRow key={s.id} skill={s} idx={i} />
        ))}
        {cat.skills.length === 0 && (
          <li className="text-xs text-slate-500 font-mono py-2">// no skills yet</li>
        )}
      </ul>
    </motion.div>
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
          subtitle="A snapshot of my current toolkit. Higher tier = more recently sharpened."
        />

        {/* shell preamble */}
        <div className="mb-6 font-mono text-[12px] text-slate-500 select-none">
          <div>
            <span className="text-cyber-green">kavith@portfolio</span>
            <span className="text-slate-500">:</span>
            <span className="text-cyber-cyan">~</span>
            <span className="text-slate-500">$ </span>
            <span className="text-slate-300">cd ./skills &amp;&amp; tree -L 1 -a</span>
          </div>
          <div className="text-slate-600">
            # tier resolved from chmod bits — `x` granted = mastery achieved.
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {categories.map((cat, idx) => (
            <CategoryBlock key={cat.id} cat={cat} idx={idx} />
          ))}
        </div>

        {/* legend */}
        <div className="mt-7 font-mono text-[11px] text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 justify-center">
          <span className="text-slate-600">$ tier_legend</span>
          <span>
            <span className="text-slate-500">drwxr-xr-x</span>{" "}
            <span className="text-cyber-cyan">master*</span>
          </span>
          <span>
            <span className="text-slate-500">-rwxr-xr-x</span>{" "}
            <span className="text-cyber-violet">proficient*</span>
          </span>
          <span>
            <span className="text-slate-500">-rwxr-x---</span>{" "}
            <span className="text-cyber-green">competent</span>
          </span>
          <span>
            <span className="text-slate-500">-rw-------</span>{" "}
            <span className="text-cyber-yellow">learning</span>
          </span>
        </div>
      </div>
    </section>
  );
}

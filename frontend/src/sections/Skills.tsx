import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { SkillCategory } from "../types";

export default function Skills({ categories }: { categories: SkillCategory[] }) {
  if (!categories.length) return null;
  return (
    <section id="skills" className="py-20 relative">
      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="02 // skills"
          title="./skills --list"
          subtitle="A snapshot of my current toolkit. Always learning, always leveling up."
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
              <div className="flex items-center gap-2 mb-4">
                {cat.icon && <span className="text-xl">{cat.icon}</span>}
                <h3 className="font-mono text-cyber-cyan text-sm uppercase tracking-wider">
                  {cat.name}
                </h3>
                <span className="ml-auto text-xs text-slate-500 font-mono">
                  {cat.skills.length}
                </span>
              </div>
              <ul className="space-y-3">
                {cat.skills.map((s) => (
                  <li key={s.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-slate-200 text-sm flex items-center gap-1.5">
                        {s.icon && <span>{s.icon}</span>}
                        {s.name}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">{s.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-bg-border overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-violet"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(Math.max(s.level, 0), 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </li>
                ))}
                {cat.skills.length === 0 && (
                  <li className="text-xs text-slate-500 font-mono">// no skills yet</li>
                )}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

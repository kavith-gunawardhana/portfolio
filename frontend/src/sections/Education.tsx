import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { Education } from "../types";
import { formatMonthYear } from "../lib/format";

export default function EducationSection({ items }: { items: Education[] }) {
  if (!items.length) return null;
  return (
    <section id="education" className="py-20 relative">
      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="04 // education"
          title="cat ./education.log"
          subtitle="Formal coursework, exams, and self-directed study paths."
        />
        <div className="relative">
          {/* connector — drawn-on scan line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute left-3 md:left-6 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-cyber-violet/60 via-cyber-cyan/40 to-transparent"
            aria-hidden
          />
          <ul className="space-y-8">
            {items.map((edu, idx) => (
              <EducationCard key={edu.id} edu={edu} idx={idx} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function EducationCard({ edu, idx }: { edu: Education; idx: number }) {
  const startYear = (edu.start_date || "").slice(0, 4);
  const endYear = edu.end_date ? edu.end_date.slice(0, 4) : "now";
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-10 md:pl-16"
    >
      {/* diamond marker */}
      <motion.span
        initial={{ scale: 0, rotate: 0 }}
        whileInView={{ scale: 1, rotate: 45 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4, delay: idx * 0.06 + 0.15, type: "spring", stiffness: 200 }}
        className="absolute left-3 md:left-6 top-3 -translate-x-1/2 w-3 h-3 bg-cyber-violet shadow-[0_0_12px_rgba(167,139,250,0.8)]"
        aria-hidden
      />

      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="card p-5 group relative overflow-hidden"
      >
        {/* subtle scanline gradient on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[linear-gradient(120deg,transparent_0%,rgba(34,211,238,0.05)_50%,transparent_100%)]" />

        <div className="flex items-start gap-4 relative">
          {edu.logo_url ? (
            <img
              src={edu.logo_url}
              alt={edu.institution}
              className="w-12 h-12 rounded object-cover border border-bg-border shrink-0"
            />
          ) : (
            <span className="w-12 h-12 rounded bg-cyber-violet/10 border border-cyber-violet/30 grid place-items-center font-mono text-cyber-violet text-lg shrink-0">
              {edu.institution.charAt(0).toUpperCase()}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-semibold text-slate-100 text-base md:text-lg">{edu.degree}</h3>
              {edu.field && (
                <span className="text-cyber-cyan text-sm font-mono truncate">
                  · {edu.field}
                </span>
              )}
            </div>

            <div className="text-sm text-slate-400 mt-0.5">
              <span className="text-cyber-violet">{edu.institution}</span>
              {edu.location && <span className="text-slate-500"> · {edu.location}</span>}
            </div>

            <div className="font-mono text-[11px] text-slate-500 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-slate-300">{startYear}</span>
              <span aria-hidden>→</span>
              <span className={endYear === "now" ? "text-cyber-cyan" : "text-slate-300"}>
                {endYear === "now"
                  ? formatMonthYear(null)
                  : formatMonthYear(edu.end_date)}
              </span>
              {edu.grade && (
                <span className="text-cyber-green truncate">· {edu.grade}</span>
              )}
            </div>

            {edu.description && (
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line mt-3">
                {edu.description}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.li>
  );
}

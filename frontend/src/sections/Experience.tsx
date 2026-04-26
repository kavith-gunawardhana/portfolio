import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { Job } from "../types";
import { formatMonthYear } from "../lib/format";

export default function Experience({ jobs }: { jobs: Job[] }) {
  if (!jobs.length) return null;
  return (
    <section id="experience" className="py-20 relative">
      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="03 // experience"
          title="git log --jobs"
          subtitle="Roles, growth, and the path so far."
        />
        <div className="relative">
          {/* timeline line */}
          <div className="absolute left-3 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyber-cyan/40 via-cyber-violet/30 to-transparent" />
          <div className="space-y-10">
            {jobs.map((job, idx) => (
              <JobCard key={job.id} job={job} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function JobCard({ job, idx }: { job: Job; idx: number }) {
  const left = idx % 2 === 0;
  const sortedPromotions = [...job.promotions].sort(
    (a, b) => (a.start_date < b.start_date ? -1 : 1),
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="relative grid md:grid-cols-2 gap-6 md:gap-10"
    >
      {/* dot */}
      <div className="absolute left-3 md:left-1/2 top-3 -translate-x-1/2 w-4 h-4 rounded-full bg-cyber-cyan ring-4 ring-cyber-cyan/20 z-10" />

      <div className={left ? "md:pr-10" : "md:order-2 md:pl-10"}>
        <div className="card p-5 ml-10 md:ml-0">
          <div className="flex items-center gap-3 mb-1">
            {job.logo_url ? (
              <img
                src={job.logo_url}
                alt={job.company}
                className="w-9 h-9 rounded object-cover border border-bg-border"
              />
            ) : (
              <span className="w-9 h-9 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 grid place-items-center font-mono text-cyber-cyan">
                {job.company.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-100 truncate">{job.title}</h3>
              <div className="text-sm text-slate-400 truncate">
                <span className="text-cyber-cyan">{job.company}</span>
                {job.location && <span className="text-slate-500"> · {job.location}</span>}
              </div>
            </div>
          </div>
          <div className="font-mono text-xs text-slate-500 mb-3">
            {formatMonthYear(job.start_date)} → {formatMonthYear(job.end_date)}
          </div>
          {job.description && (
            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          )}

          {sortedPromotions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-bg-border space-y-3">
              <div className="text-[11px] uppercase tracking-wider font-mono text-cyber-violet">
                ↗ promotions / role changes
              </div>
              <ul className="space-y-3">
                {sortedPromotions.map((p) => (
                  <li key={p.id} className="text-sm">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-slate-100 font-medium">{p.title}</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {formatMonthYear(p.start_date)}
                      </span>
                    </div>
                    {p.description && (
                      <p className="text-slate-400 text-sm mt-1 whitespace-pre-line">
                        {p.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

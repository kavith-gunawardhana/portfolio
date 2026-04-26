import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { Certification } from "../types";
import { formatMonthYear } from "../lib/format";

export default function Certifications({ items }: { items: Certification[] }) {
  if (!items.length) return null;
  return (
    <section id="certifications" className="py-20 relative">
      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="05 // certifications"
          title="ls -la certs/"
          subtitle="Verifiable credentials and ongoing learning milestones."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="card p-5 group"
            >
              <div className="flex items-start gap-3 mb-3">
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={c.name}
                    className="w-12 h-12 rounded object-cover border border-bg-border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-cyber-violet/10 border border-cyber-violet/30 grid place-items-center text-cyber-violet text-xl">
                    🛡️
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-100 leading-tight">{c.name}</h3>
                  <div className="text-sm text-cyber-cyan truncate">{c.issuer}</div>
                </div>
              </div>
              <div className="font-mono text-xs text-slate-500 mb-3">
                {c.issued_date && <>issued: {formatMonthYear(c.issued_date)}</>}
                {c.expires_date && <> · expires: {formatMonthYear(c.expires_date)}</>}
              </div>
              {c.description && (
                <p className="text-sm text-slate-400 mb-3 whitespace-pre-line">{c.description}</p>
              )}
              <div className="flex items-center gap-3 text-xs font-mono">
                {c.credential_id && (
                  <span className="text-slate-500">id: {c.credential_id}</span>
                )}
                {c.credential_url && (
                  <a
                    href={c.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto text-cyber-cyan hover:underline"
                  >
                    verify ↗
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

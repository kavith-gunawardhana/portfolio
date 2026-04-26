import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { Project } from "../types";
import { parseTags } from "../lib/format";

export default function Projects({ items }: { items: Project[] }) {
  if (!items.length) return null;
  return (
    <section id="projects" className="py-20 relative">
      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="06 // projects"
          title="./projects --all"
          subtitle="Hands-on experiments, CTF writeups, home-lab work, and shipped tools."
        />
        <div className="grid md:grid-cols-2 gap-5">
          {items.map((p, idx) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="card overflow-hidden flex flex-col"
            >
              {p.image_url && (
                <div className="h-44 overflow-hidden border-b border-bg-border bg-black/40">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="font-semibold text-slate-100 leading-tight">
                    {p.title}
                    {p.featured && (
                      <span className="ml-2 align-middle badge-violet">featured</span>
                    )}
                  </h3>
                </div>
                {p.summary && (
                  <p className="text-sm text-slate-400 mb-3 whitespace-pre-line">{p.summary}</p>
                )}
                {p.description && (
                  <details className="text-sm text-slate-300 mb-3">
                    <summary className="cursor-pointer text-cyber-cyan font-mono text-xs">
                      $ cat README.md
                    </summary>
                    <div className="mt-2 whitespace-pre-line text-slate-300">{p.description}</div>
                  </details>
                )}
                {parseTags(p.tags_json).length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                    {parseTags(p.tags_json).map((t) => (
                      <span key={t} className="badge-cyan">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex gap-3 text-xs font-mono">
                  {p.repo_url && (
                    <a
                      href={p.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyber-cyan hover:underline"
                    >
                      source ↗
                    </a>
                  )}
                  {p.demo_url && (
                    <a
                      href={p.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyber-violet hover:underline"
                    >
                      demo ↗
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

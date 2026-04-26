import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { SiteSettings } from "../types";

export default function About({ settings }: { settings: SiteSettings }) {
  if (!settings.bio) return null;
  return (
    <section id="about" className="py-20 relative">
      <div className="container-custom relative z-10">
        <SectionHeader eyebrow="01 // about" title="cat about.md" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-2 panel p-6">
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">{settings.bio}</p>
          </div>
          <div className="panel p-6 space-y-3 font-mono text-sm">
            {settings.location && (
              <Row label="location" value={settings.location} />
            )}
            {settings.email && <Row label="email" value={settings.email} />}
            {settings.handle && <Row label="handle" value={settings.handle} />}
            {settings.github_url && (
              <Row label="github" value={shortenUrl(settings.github_url)} href={settings.github_url} />
            )}
            {settings.linkedin_url && (
              <Row label="linkedin" value={shortenUrl(settings.linkedin_url)} href={settings.linkedin_url} />
            )}
            {settings.twitter_url && (
              <Row label="twitter" value={shortenUrl(settings.twitter_url)} href={settings.twitter_url} />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Row({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-cyber-violet w-20 shrink-0">{label}</span>
      <span className="text-slate-500">::</span>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="text-cyber-cyan hover:underline truncate">
          {value}
        </a>
      ) : (
        <span className="text-slate-200 truncate">{value}</span>
      )}
    </div>
  );
}

function shortenUrl(u: string): string {
  return u.replace(/^https?:\/\/(www\.)?/, "");
}

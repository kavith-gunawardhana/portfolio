import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { SiteSettings } from "../types";
import { api } from "../lib/api";

export default function Contact({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErr("");
    try {
      await api.post("/api/contact", form);
      setStatus("ok");
      setForm({ name: "", email: "", message: "" });
    } catch (e) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setErr(msg || "Failed to send message");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-20 relative">
      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="06 // contact"
          title="./connect --secure"
          subtitle="Open to internships, junior security roles, CTF teammates, and friendly chats."
        />
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2 panel p-6">
            <div className="font-mono text-sm space-y-3">
              <Pair k="email" v={settings.email} href={settings.email && `mailto:${settings.email}`} />
              <Pair k="github" v={settings.github_url} href={settings.github_url} />
              <Pair k="linkedin" v={settings.linkedin_url} href={settings.linkedin_url} />
              <Pair k="twitter" v={settings.twitter_url} href={settings.twitter_url} />
              <Pair k="website" v={settings.website_url} href={settings.website_url} />
            </div>
            <div className="mt-6 pt-6 border-t border-bg-border">
              <div className="font-mono text-xs text-slate-500 mb-2">// pgp / channels</div>
              <p className="text-sm text-slate-400">
                Reach out via any channel above, or send a message directly. Replies are usually
                quick.
              </p>
            </div>
          </div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="md:col-span-3 panel p-6 space-y-4"
          >
            <div>
              <label className="label">name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                maxLength={100}
              />
            </div>
            <div>
              <label className="label">email</label>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                maxLength={200}
              />
            </div>
            <div>
              <label className="label">message</label>
              <textarea
                className="input min-h-[140px] resize-y"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                maxLength={5000}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="btn-primary"
                disabled={status === "sending"}
              >
                {status === "sending" ? "transmitting…" : "$ send"}
              </button>
              {status === "ok" && (
                <span className="font-mono text-sm text-cyber-green">
                  ✓ message received
                </span>
              )}
              {status === "error" && (
                <span className="font-mono text-sm text-red-400">{err}</span>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Pair({ k, v, href }: { k: string; v: string; href?: string | false }) {
  if (!v) return null;
  const display = v.replace(/^https?:\/\/(www\.)?/, "").replace(/^mailto:/, "");
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-cyber-violet w-20 shrink-0">{k}</span>
      <span className="text-slate-500">::</span>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="text-cyber-cyan hover:underline truncate">
          {display}
        </a>
      ) : (
        <span className="text-slate-200 truncate">{display}</span>
      )}
    </div>
  );
}

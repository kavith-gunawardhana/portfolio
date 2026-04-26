import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { SiteSettings } from "../../types";
import ImageUpload from "../../components/ImageUpload";

export default function SettingsPage() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [terminalLines, setTerminalLines] = useState("");
  const [focusAreas, setFocusAreas] = useState("");

  useEffect(() => {
    api.get<SiteSettings>("/api/settings").then((r) => {
      setS(r.data);
      try {
        const t = JSON.parse(r.data.terminal_lines_json);
        if (Array.isArray(t)) setTerminalLines(t.join("\n"));
      } catch {
        setTerminalLines("");
      }
      try {
        const t = JSON.parse(r.data.focus_areas_json);
        if (Array.isArray(t)) setFocusAreas(t.join(", "));
      } catch {
        setFocusAreas("");
      }
    });
  }, []);

  if (!s) return <div className="font-mono text-slate-500">loading…</div>;

  function update<K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) {
    setS((prev) => (prev ? { ...prev, [k]: v } : prev));
  }

  async function save() {
    if (!s) return;
    setSaving(true);
    setMsg("");
    try {
      const lines = terminalLines.split("\n").map((l) => l.trim()).filter(Boolean);
      const focus = focusAreas
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);
      const payload = {
        ...s,
        terminal_lines_json: JSON.stringify(lines),
        focus_areas_json: JSON.stringify(focus),
      };
      const r = await api.put<SiteSettings>("/api/settings", payload);
      setS(r.data);
      setMsg("✓ saved");
      setTimeout(() => setMsg(""), 2500);
    } catch {
      setMsg("✗ failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">
        <span className="text-cyber-cyan font-mono">$</span> site settings
      </h1>
      <p className="text-slate-400 text-sm font-mono mb-6">// hero, bio, contacts, theme</p>

      <div className="panel p-6 space-y-5">
        <Section title="identity">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="full name">
              <input className="input" value={s.full_name} onChange={(e) => update("full_name", e.target.value)} />
            </Field>
            <Field label="handle">
              <input className="input" value={s.handle} onChange={(e) => update("handle", e.target.value)} />
            </Field>
          </div>
          <Field label="tagline">
            <input className="input" value={s.tagline} onChange={(e) => update("tagline", e.target.value)} />
          </Field>
          <Field label="bio">
            <textarea
              className="input min-h-[120px]"
              value={s.bio}
              onChange={(e) => update("bio", e.target.value)}
            />
          </Field>
          <ImageUpload
            label="avatar"
            value={s.avatar_url}
            onChange={(v) => update("avatar_url", v)}
            hint="optional — appears in some layouts"
          />
        </Section>

        <Section title="hero terminal">
          <Field label="terminal lines (one per line, alternating $ command / output)">
            <textarea
              className="input min-h-[140px] font-mono"
              placeholder={"whoami\nkavith — cybersecurity student\ncat focus.txt\nctfs · blue team · offensive"}
              value={terminalLines}
              onChange={(e) => setTerminalLines(e.target.value)}
            />
          </Field>
          <Field label="focus areas (comma separated)">
            <input
              className="input"
              placeholder="Pentesting, Network Security, CTFs"
              value={focusAreas}
              onChange={(e) => setFocusAreas(e.target.value)}
            />
          </Field>
        </Section>

        <Section title="contact / links">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="email">
              <input className="input" value={s.email} onChange={(e) => update("email", e.target.value)} />
            </Field>
            <Field label="location">
              <input className="input" value={s.location} onChange={(e) => update("location", e.target.value)} />
            </Field>
            <Field label="github url">
              <input className="input" value={s.github_url} onChange={(e) => update("github_url", e.target.value)} />
            </Field>
            <Field label="linkedin url">
              <input className="input" value={s.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} />
            </Field>
            <Field label="twitter url">
              <input className="input" value={s.twitter_url} onChange={(e) => update("twitter_url", e.target.value)} />
            </Field>
            <Field label="website url">
              <input className="input" value={s.website_url} onChange={(e) => update("website_url", e.target.value)} />
            </Field>
            <Field label="resume url">
              <input className="input" value={s.resume_url} onChange={(e) => update("resume_url", e.target.value)} />
            </Field>
          </div>
        </Section>

        <Section title="theme">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="primary color (hex)">
              <input className="input font-mono" value={s.primary_color} onChange={(e) => update("primary_color", e.target.value)} />
            </Field>
            <Field label="accent color (hex)">
              <input className="input font-mono" value={s.accent_color} onChange={(e) => update("accent_color", e.target.value)} />
            </Field>
          </div>
          <p className="text-[11px] font-mono text-slate-500">
            Note: theme colors apply to data, but the global cyberpunk palette stays unified.
          </p>
        </Section>

        <div className="pt-2 flex items-center gap-3">
          <button className="btn-primary" disabled={saving} onClick={save}>
            {saving ? "saving…" : "$ save"}
          </button>
          {msg && <span className="font-mono text-sm text-cyber-green">{msg}</span>}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="font-mono text-xs uppercase tracking-wider text-cyber-violet">
        # {title}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

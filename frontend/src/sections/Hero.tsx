import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SiteSettings } from "../types";
import { parseStringArray } from "../lib/format";

interface Props {
  settings: SiteSettings;
}

export default function Hero({ settings }: Props) {
  const lines = parseStringArray(settings.terminal_lines_json);
  const focus = parseStringArray(settings.focus_areas_json);
  const [typed, setTyped] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (lines.length === 0 || done) return;
    if (lineIdx >= lines.length) {
      const finishTimer = setTimeout(() => setDone(true), 0);
      return () => clearTimeout(finishTimer);
    }
    const target = lines[lineIdx];
    if (currentLine.length < target.length) {
      const t = setTimeout(() => {
        setCurrentLine(target.slice(0, currentLine.length + 1));
      }, 35 + Math.random() * 35);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setTyped((arr) => [...arr, target]);
      setCurrentLine("");
      setLineIdx((i) => i + 1);
    }, 280);
    return () => clearTimeout(t);
  }, [currentLine, lineIdx, lines, done]);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* grid backdrop */}
      <div className="absolute inset-0 grid-bg opacity-50 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_70%)]" />
      {/* scanline */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 h-[2px] bg-cyber-cyan/20 blur-sm animate-scan" />
      </div>

      <div className="container-custom relative z-10 grid md:grid-cols-5 gap-10 items-center">
        <div className="md:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="font-mono text-xs uppercase tracking-[0.4em] text-cyber-cyan/80">
              <span className="inline-block w-2 h-2 rounded-full bg-cyber-green animate-pulse mr-2" />
              status: online · learning · {settings.location || "remote"}
            </div>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight tracking-tight text-slate-50">
              <span className="block">Hi, I&apos;m</span>
              <span className="block text-cyber-cyan glow-text">{settings.full_name}</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl">{settings.tagline}</p>

            {focus.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {focus.map((f) => (
                  <span key={f} className="badge-cyan">
                    <span className="text-cyber-violet">#</span>
                    {f}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="btn-primary">
                <span className="font-mono">$</span> get in touch
              </a>
              <a href="#projects" className="btn-ghost">
                view projects →
              </a>
              {settings.resume_url && (
                <a
                  href={settings.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                >
                  resume.pdf ↗
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:col-span-2"
        >
          <div className="panel overflow-hidden shadow-glow">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-bg-border bg-bg/60">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              <span className="ml-3 font-mono text-xs text-slate-400">
                ~/portfolio · zsh — 80×24
              </span>
            </div>
            <div className="p-4 font-mono text-sm leading-relaxed min-h-[260px]">
              {typed.map((line, i) => (
                <Line key={i} idx={i} text={line} />
              ))}
              {!done && (
                <div className="terminal-line">
                  {lineIdx % 2 === 0 ? (
                    <span className="text-cyber-green">➜</span>
                  ) : (
                    <span className="text-slate-500"># </span>
                  )}{" "}
                  <span className="text-slate-200">{currentLine}</span>
                  <span className="inline-block w-2 h-4 ml-0.5 bg-cyber-cyan align-middle animate-blink" />
                </div>
              )}
              {done && (
                <div className="terminal-line">
                  <span className="text-cyber-green">➜</span>{" "}
                  <span className="text-slate-200">_</span>
                  <span className="inline-block w-2 h-4 ml-0.5 bg-cyber-cyan align-middle animate-blink" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Line({ idx, text }: { idx: number; text: string }) {
  const isCmd = idx % 2 === 0;
  return (
    <div className="terminal-line">
      {isCmd ? (
        <>
          <span className="text-cyber-green">➜</span>{" "}
          <span className="text-cyber-cyan">~/portfolio</span>{" "}
          <span className="text-slate-100">{text}</span>
        </>
      ) : (
        <span className="text-slate-400">{text}</span>
      )}
    </div>
  );
}

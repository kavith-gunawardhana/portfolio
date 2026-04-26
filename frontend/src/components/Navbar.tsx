import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

const links = [
  { id: "hero", label: "~/" },
  { id: "about", label: "about" },
  { id: "skills", label: "skills" },
  { id: "experience", label: "experience" },
  { id: "education", label: "education" },
  { id: "certifications", label: "certs" },
  { id: "projects", label: "projects" },
  { id: "contact", label: "contact" },
];

export default function Navbar({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      // detect active section
      let current = "hero";
      for (const link of links) {
        const el = document.getElementById(link.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) current = link.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 inset-x-0 z-40 transition-all duration-300",
        scrolled ? "bg-bg/80 backdrop-blur-md border-b border-bg-border" : "bg-transparent",
      )}
    >
      <div className="container-custom flex items-center justify-between h-16">
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="font-mono text-cyber-cyan text-lg group-hover:animate-glitch">$</span>
          <span className="font-mono font-semibold text-slate-100">
            {name || "portfolio"}
            <span className="text-cyber-cyan animate-blink">_</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={clsx(
                "px-3 py-2 rounded font-mono text-sm transition",
                active === l.id
                  ? "text-cyber-cyan bg-cyber-cyan/10"
                  : "text-slate-300 hover:text-cyber-cyan hover:bg-cyber-cyan/5",
              )}
            >
              {l.label}
            </a>
          ))}
          <Link to="/admin" className="ml-2 btn-ghost text-xs px-3 py-1.5">
            admin
          </Link>
        </nav>

        <button
          aria-label="menu"
          className="md:hidden p-2 text-slate-200"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-6 h-px bg-current mb-1.5" />
          <span className="block w-6 h-px bg-current mb-1.5" />
          <span className="block w-6 h-px bg-current" />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-bg-border bg-bg/95 backdrop-blur">
          <div className="container-custom py-3 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="px-2 py-2 font-mono text-sm text-slate-200 hover:text-cyber-cyan"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="px-2 py-2 font-mono text-sm text-cyber-violet"
            >
              admin →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

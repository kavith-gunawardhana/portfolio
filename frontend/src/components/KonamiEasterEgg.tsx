import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Listens for the Konami code (↑↑↓↓←→←→BA) and reveals a hidden terminal
 * overlay. Dispatches a `konami` window event so other components (e.g.
 * MatrixBackground) can intensify their effects while the overlay is
 * active.
 */
export default function KonamiEasterEgg() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let buf: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buf = [...buf, key].slice(-SEQUENCE.length);
      if (
        buf.length === SEQUENCE.length &&
        buf.every((k, i) => k === SEQUENCE[i])
      ) {
        setActive(true);
        window.dispatchEvent(new CustomEvent("konami"));
        buf = [];
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), 8000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center"
          aria-hidden
        >
          <motion.div
            initial={{ scale: 0.85, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -8 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="panel px-6 py-5 max-w-md w-[92%] shadow-glow-violet"
          >
            <div className="flex items-center gap-2 mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-cyber-violet">
              <span className="inline-block w-2 h-2 rounded-full bg-cyber-violet animate-pulse" />
              backdoor // unlocked
            </div>
            <pre className="font-mono text-cyber-cyan text-sm whitespace-pre-wrap leading-relaxed">
{`$ sudo ./reveal --konami
[ok] root shell granted
[ok] you found the easter egg

> "the only secure system is one
   that's powered off, encased in
   concrete, and at the bottom of
   the ocean — and even then i
   have my doubts."
                  — gene spafford

# stay curious. break things ethically.`}
            </pre>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

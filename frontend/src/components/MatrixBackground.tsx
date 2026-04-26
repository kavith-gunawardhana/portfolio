import { useEffect, useRef } from "react";

/**
 * Subtle Matrix-style falling-character backdrop.
 * Drawn on a fixed full-screen canvas; pointer-events: none.
 */
export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = new Array(columns).fill(1);

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ$#@%&*+=<>".split("");

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1);
    }
    window.addEventListener("resize", resize);

    let intensifyUntil = 0;
    const onIntensify = () => {
      intensifyUntil = performance.now() + 8000;
    };
    window.addEventListener("konami", onIntensify);

    let raf = 0;
    let last = 0;
    function draw(ts: number) {
      if (!ctx || !canvas) return;
      // Throttle to ~30fps
      if (ts - last < 33) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = ts;

      const intense = ts < intensifyUntil;
      ctx.fillStyle = intense ? "rgba(5, 7, 13, 0.04)" : "rgba(5, 7, 13, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px JetBrains Mono, monospace`;
      const passes = intense ? 2 : 1;
      for (let p = 0; p < passes; p++) {
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;
          // Head is brighter; in intense mode pink heads appear
          if (intense && Math.random() < 0.03) {
            ctx.fillStyle = "#f472b6";
          } else if (Math.random() < 0.04) {
            ctx.fillStyle = "#a78bfa";
          } else {
            ctx.fillStyle = "#22d3ee";
          }
          ctx.fillText(text, x, y);
          if (y > height && Math.random() > (intense ? 0.94 : 0.975)) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("konami", onIntensify);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" aria-hidden="true" />;
}

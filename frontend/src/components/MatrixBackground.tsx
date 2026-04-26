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

      ctx.fillStyle = "rgba(5, 7, 13, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px JetBrains Mono, monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        // Head is brighter
        ctx.fillStyle = Math.random() < 0.04 ? "#a78bfa" : "#22d3ee";
        ctx.fillText(text, x, y);
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" aria-hidden="true" />;
}

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin animated progress strip pinned to the top of the viewport that
 * tracks vertical scroll. Draws over everything else.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    mass: 0.4,
  });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-pink"
      style={{ scaleX, boxShadow: "0 0 10px rgba(34,211,238,0.6)" }}
      aria-hidden
    />
  );
}

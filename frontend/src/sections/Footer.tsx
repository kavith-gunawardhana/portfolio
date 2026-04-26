import { SiteSettings } from "../types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-bg-border mt-10 py-8">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500">
        <div className="font-mono">
          <span className="text-cyber-cyan">$</span> echo &quot;© {year} {settings.full_name}&quot;
        </div>
        <div className="font-mono">
          built with <span className="text-cyber-cyan">vite</span> +{" "}
          <span className="text-cyber-violet">react</span> +{" "}
          <span className="text-cyber-green">fastapi</span>
        </div>
      </div>
    </footer>
  );
}

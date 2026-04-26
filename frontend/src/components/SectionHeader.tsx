interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  prefix?: string;
}

export default function SectionHeader({ eyebrow, title, subtitle, prefix = "//" }: Props) {
  return (
    <div className="mb-10">
      <div className="section-eyebrow">
        <span className="text-cyber-violet">{prefix}</span> {eyebrow}
      </div>
      <h2 className="section-title text-slate-100">
        <span className="text-cyber-cyan font-mono">$</span> {title}
      </h2>
      {subtitle && <p className="text-slate-400 mt-3 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

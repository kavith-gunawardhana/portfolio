import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

interface Counts {
  skills: number;
  categories: number;
  jobs: number;
  promotions: number;
  certifications: number;
  projects: number;
  messages: number;
  unread: number;
}

export default function DashboardPage() {
  const [c, setC] = useState<Counts | null>(null);

  useEffect(() => {
    Promise.all([
      api.get("/api/skill-categories"),
      api.get("/api/jobs"),
      api.get("/api/certifications"),
      api.get("/api/projects"),
      api.get("/api/contact/messages"),
    ]).then(([cats, jobs, certs, projs, msgs]) => {
      const skillsCount = cats.data.reduce(
        (n: number, cat: { skills: unknown[] }) => n + cat.skills.length,
        0,
      );
      const promoCount = jobs.data.reduce(
        (n: number, j: { promotions: unknown[] }) => n + j.promotions.length,
        0,
      );
      const unread = (msgs.data as { read: boolean }[]).filter((m) => !m.read).length;
      setC({
        categories: cats.data.length,
        skills: skillsCount,
        jobs: jobs.data.length,
        promotions: promoCount,
        certifications: certs.data.length,
        projects: projs.data.length,
        messages: msgs.data.length,
        unread,
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">
        <span className="text-cyber-cyan font-mono">$</span> dashboard
      </h1>
      <p className="text-slate-400 mb-6 font-mono text-sm">// system overview</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="skill categories" value={c?.categories} link="/admin/skills" />
        <Stat label="skills" value={c?.skills} link="/admin/skills" />
        <Stat label="jobs" value={c?.jobs} link="/admin/jobs" />
        <Stat label="promotions" value={c?.promotions} link="/admin/jobs" />
        <Stat label="certifications" value={c?.certifications} link="/admin/certifications" />
        <Stat label="projects" value={c?.projects} link="/admin/projects" />
        <Stat label="messages" value={c?.messages} link="/admin/messages" />
        <Stat label="unread" value={c?.unread} link="/admin/messages" highlight={!!c?.unread} />
      </div>

      <div className="mt-8 panel p-6">
        <h2 className="font-mono text-cyber-cyan text-sm uppercase tracking-wider mb-3">
          # quick actions
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/settings" className="btn-ghost">edit site settings</Link>
          <Link to="/admin/skills" className="btn-ghost">add skill</Link>
          <Link to="/admin/jobs" className="btn-ghost">add job</Link>
          <Link to="/admin/certifications" className="btn-ghost">add certification</Link>
          <Link to="/admin/projects" className="btn-ghost">add project</Link>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  link,
  highlight,
}: {
  label: string;
  value: number | undefined;
  link: string;
  highlight?: boolean;
}) {
  return (
    <Link
      to={link}
      className="card p-4 block hover:border-cyber-cyan/50"
    >
      <div className="text-xs font-mono uppercase tracking-wider text-slate-500">{label}</div>
      <div
        className={
          "text-2xl font-bold mt-1 font-mono " +
          (highlight ? "text-cyber-violet" : "text-cyber-cyan")
        }
      >
        {value ?? "—"}
      </div>
    </Link>
  );
}

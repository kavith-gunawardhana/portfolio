import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import clsx from "clsx";

const navItems = [
  { to: "/admin", end: true, label: "dashboard", icon: "▣" },
  { to: "/admin/settings", label: "site settings", icon: "⚙" },
  { to: "/admin/skills", label: "skills", icon: "⚔" },
  { to: "/admin/jobs", label: "experience", icon: "💼" },
  { to: "/admin/certifications", label: "certifications", icon: "🛡" },
  { to: "/admin/projects", label: "projects", icon: "📦" },
  { to: "/admin/messages", label: "messages", icon: "✉" },
];

export default function AdminLayout() {
  const { username, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-64 md:min-h-screen border-r border-bg-border bg-bg-panel/60 backdrop-blur p-5">
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-cyber-cyan">$</span>
          <h1 className="font-mono font-semibold">
            admin<span className="animate-blink text-cyber-cyan">_</span>
          </h1>
        </div>
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  "px-3 py-2 rounded font-mono text-sm transition flex items-center gap-2 whitespace-nowrap",
                  isActive
                    ? "bg-cyber-cyan/10 text-cyber-cyan"
                    : "text-slate-300 hover:text-cyber-cyan hover:bg-cyber-cyan/5",
                )
              }
            >
              <span className="text-cyber-violet w-4">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 pt-6 border-t border-bg-border space-y-2">
          <div className="text-xs font-mono text-slate-500">logged in as</div>
          <div className="text-sm font-mono text-slate-100">{username || "—"}</div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="block text-xs font-mono text-cyber-cyan hover:underline"
          >
            ↗ view site
          </a>
          <button
            onClick={() => {
              logout();
              nav("/admin/login");
            }}
            className="btn-danger w-full text-xs"
          >
            $ logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-8 max-w-full">
        <Outlet />
      </main>
    </div>
  );
}

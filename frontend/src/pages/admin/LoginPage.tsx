import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(u, p);
      nav("/admin", { replace: true });
    } catch (error) {
      const msg = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setErr(msg || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={submit} className="panel w-full max-w-sm p-6 shadow-glow">
        <div className="font-mono text-xs text-cyber-cyan mb-1">$ ssh admin@portfolio</div>
        <h1 className="text-xl font-bold mb-4 text-slate-100">admin login</h1>

        <label className="label">username</label>
        <input
          autoFocus
          autoComplete="username"
          className="input mb-3"
          value={u}
          onChange={(e) => setU(e.target.value)}
          required
        />

        <label className="label">password</label>
        <input
          type="password"
          autoComplete="current-password"
          className="input mb-4"
          value={p}
          onChange={(e) => setP(e.target.value)}
          required
        />

        {err && <div className="font-mono text-sm text-red-400 mb-3">{err}</div>}

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "authenticating…" : "$ login"}
        </button>
        <a href="/" className="block text-center mt-4 text-xs font-mono text-slate-500 hover:text-cyber-cyan">
          ← back to site
        </a>
      </form>
    </div>
  );
}

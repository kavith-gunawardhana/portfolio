import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center text-center px-6">
      <div>
        <div className="font-mono text-cyber-cyan text-sm mb-2">$ ./find_route → ENOENT</div>
        <h1 className="text-5xl font-bold mb-2 glow-text">404</h1>
        <p className="text-slate-400 mb-6">The route you requested was not found.</p>
        <Link to="/" className="btn-primary">
          ← cd ..
        </Link>
      </div>
    </div>
  );
}

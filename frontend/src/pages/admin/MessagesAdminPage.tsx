import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { ContactMessage } from "../../types";
import AdminTable from "../../components/AdminTable";

export default function MessagesAdminPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);

  function refresh() {
    api.get<ContactMessage[]>("/api/contact/messages").then((r) => setItems(r.data));
  }
  useEffect(refresh, []);

  async function markRead(id: number) {
    await api.post(`/api/contact/messages/${id}/read`);
    refresh();
  }

  async function del(id: number) {
    if (!confirm("Delete this message?")) return;
    await api.delete(`/api/contact/messages/${id}`);
    refresh();
  }

  return (
    <AdminTable title="messages" description="contact form submissions">
      {items.length === 0 && (
        <div className="card p-8 text-center text-slate-500 font-mono text-sm">no messages yet</div>
      )}
      {items.map((m) => (
        <div key={m.id} className={"card p-4 " + (m.read ? "opacity-70" : "")}>
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-100">{m.name}</span>
                <a href={`mailto:${m.email}`} className="text-cyber-cyan font-mono text-xs hover:underline">
                  {m.email}
                </a>
                {!m.read && <span className="badge-violet">new</span>}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                {new Date(m.created_at).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              {!m.read && (
                <button className="btn-ghost text-xs" onClick={() => markRead(m.id)}>
                  mark read
                </button>
              )}
              <button className="btn-danger text-xs" onClick={() => del(m.id)}>
                delete
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-300 whitespace-pre-line">{m.message}</p>
        </div>
      ))}
    </AdminTable>
  );
}

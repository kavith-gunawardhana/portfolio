import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Certification } from "../../types";
import AdminTable from "../../components/AdminTable";
import Modal from "../../components/Modal";
import ImageUpload from "../../components/ImageUpload";
import { formatMonthYear } from "../../lib/format";

export default function CertsAdminPage() {
  const [items, setItems] = useState<Certification[]>([]);
  const [edit, setEdit] = useState<Partial<Certification> | null>(null);

  function refresh() {
    api.get<Certification[]>("/api/certifications").then((r) => setItems(r.data));
  }
  useEffect(refresh, []);

  async function save() {
    if (!edit || !edit.name || !edit.issuer) return;
    const payload = {
      name: edit.name,
      issuer: edit.issuer,
      issued_date: edit.issued_date || null,
      expires_date: edit.expires_date || null,
      credential_id: edit.credential_id || "",
      credential_url: edit.credential_url || "",
      image_url: edit.image_url || "",
      description: edit.description || "",
      sort_order: edit.sort_order ?? 0,
    };
    if (edit.id) await api.put(`/api/certifications/${edit.id}`, payload);
    else await api.post("/api/certifications", payload);
    setEdit(null);
    refresh();
  }

  async function del(id: number) {
    if (!confirm("Delete this certification?")) return;
    await api.delete(`/api/certifications/${id}`);
    refresh();
  }

  return (
    <AdminTable
      title="certifications"
      description="credentials, badges, learning milestones"
      onAdd={() => setEdit({ sort_order: items.length })}
      addLabel="+ new certification"
    >
      {items.length === 0 && (
        <div className="card p-8 text-center text-slate-500 font-mono text-sm">none yet</div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((c) => (
          <div key={c.id} className="card p-4 flex gap-3">
            {c.image_url ? (
              <img src={c.image_url} alt="" className="w-14 h-14 rounded object-cover" />
            ) : (
              <div className="w-14 h-14 rounded bg-cyber-violet/10 border border-cyber-violet/30 grid place-items-center text-xl">
                🛡
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-100 truncate">{c.name}</div>
              <div className="text-xs text-cyber-cyan truncate">{c.issuer}</div>
              <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                {c.issued_date && `issued ${formatMonthYear(c.issued_date)}`}
                {c.expires_date && ` · exp ${formatMonthYear(c.expires_date)}`}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <button className="btn-ghost text-xs" onClick={() => setEdit(c)}>edit</button>
              <button className="btn-danger text-xs" onClick={() => del(c.id)}>delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? "edit certification" : "new certification"}
        size="lg"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEdit(null)}>cancel</button>
            <button className="btn-primary" onClick={save}>save</button>
          </>
        }
      >
        {edit && (
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label">name *</label>
                <input className="input" value={edit.name || ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
              </div>
              <div>
                <label className="label">issuer *</label>
                <input className="input" value={edit.issuer || ""} onChange={(e) => setEdit({ ...edit, issuer: e.target.value })} />
              </div>
              <div>
                <label className="label">issued date</label>
                <input type="date" className="input" value={edit.issued_date || ""} onChange={(e) => setEdit({ ...edit, issued_date: e.target.value || null })} />
              </div>
              <div>
                <label className="label">expires date</label>
                <input type="date" className="input" value={edit.expires_date || ""} onChange={(e) => setEdit({ ...edit, expires_date: e.target.value || null })} />
              </div>
              <div>
                <label className="label">credential id</label>
                <input className="input" value={edit.credential_id || ""} onChange={(e) => setEdit({ ...edit, credential_id: e.target.value })} />
              </div>
              <div>
                <label className="label">credential url</label>
                <input className="input" value={edit.credential_url || ""} onChange={(e) => setEdit({ ...edit, credential_url: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">description</label>
                <textarea className="input min-h-[80px]" value={edit.description || ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
              </div>
              <div>
                <label className="label">sort order</label>
                <input type="number" className="input" value={edit.sort_order ?? 0} onChange={(e) => setEdit({ ...edit, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <ImageUpload
              label="badge / image"
              value={edit.image_url || ""}
              onChange={(v) => setEdit({ ...edit, image_url: v })}
            />
          </div>
        )}
      </Modal>
    </AdminTable>
  );
}

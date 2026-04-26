import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Project } from "../../types";
import AdminTable from "../../components/AdminTable";
import Modal from "../../components/Modal";
import ImageUpload from "../../components/ImageUpload";
import { parseTags } from "../../lib/format";

interface Draft extends Partial<Project> {
  tagsText?: string;
}

export default function ProjectsAdminPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [edit, setEdit] = useState<Draft | null>(null);

  function refresh() {
    api.get<Project[]>("/api/projects").then((r) => setItems(r.data));
  }
  useEffect(refresh, []);

  function openEdit(p?: Project) {
    if (p) {
      setEdit({ ...p, tagsText: parseTags(p.tags_json).join(", ") });
    } else {
      setEdit({ sort_order: items.length, tagsText: "" });
    }
  }

  async function save() {
    if (!edit || !edit.title) return;
    const tags = (edit.tagsText || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = {
      title: edit.title,
      summary: edit.summary || "",
      description: edit.description || "",
      tags_json: JSON.stringify(tags),
      repo_url: edit.repo_url || "",
      demo_url: edit.demo_url || "",
      image_url: edit.image_url || "",
      featured: !!edit.featured,
      sort_order: edit.sort_order ?? 0,
    };
    if (edit.id) await api.put(`/api/projects/${edit.id}`, payload);
    else await api.post("/api/projects", payload);
    setEdit(null);
    refresh();
  }

  async function del(id: number) {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/api/projects/${id}`);
    refresh();
  }

  return (
    <AdminTable
      title="projects"
      description="CTFs, labs, tools, writeups"
      onAdd={() => openEdit()}
      addLabel="+ new project"
    >
      {items.length === 0 && (
        <div className="card p-8 text-center text-slate-500 font-mono text-sm">none yet</div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((p) => (
          <div key={p.id} className="card p-4">
            <div className="flex items-start gap-3">
              {p.image_url ? (
                <img src={p.image_url} alt="" className="w-16 h-16 rounded object-cover" />
              ) : (
                <div className="w-16 h-16 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 grid place-items-center text-xl text-cyber-cyan">
                  📦
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-slate-100 truncate">{p.title}</div>
                  {p.featured && <span className="badge-violet">featured</span>}
                </div>
                {p.summary && <div className="text-xs text-slate-400 line-clamp-2">{p.summary}</div>}
                <div className="mt-1 flex flex-wrap gap-1">
                  {parseTags(p.tags_json).slice(0, 5).map((t) => (
                    <span key={t} className="badge-cyan">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button className="btn-ghost text-xs" onClick={() => openEdit(p)}>edit</button>
                <button className="btn-danger text-xs" onClick={() => del(p.id)}>delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? "edit project" : "new project"}
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
            <div>
              <label className="label">title *</label>
              <input className="input" value={edit.title || ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
            </div>
            <div>
              <label className="label">summary (one-liner)</label>
              <input className="input" value={edit.summary || ""} onChange={(e) => setEdit({ ...edit, summary: e.target.value })} />
            </div>
            <div>
              <label className="label">description (long)</label>
              <textarea className="input min-h-[120px]" value={edit.description || ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
            </div>
            <div>
              <label className="label">tags (comma separated)</label>
              <input className="input" value={edit.tagsText || ""} onChange={(e) => setEdit({ ...edit, tagsText: e.target.value })} placeholder="HackTheBox, OSINT, Python" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label">repo url</label>
                <input className="input" value={edit.repo_url || ""} onChange={(e) => setEdit({ ...edit, repo_url: e.target.value })} />
              </div>
              <div>
                <label className="label">demo / writeup url</label>
                <input className="input" value={edit.demo_url || ""} onChange={(e) => setEdit({ ...edit, demo_url: e.target.value })} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 items-center">
              <label className="flex items-center gap-2 text-sm font-mono mt-5">
                <input
                  type="checkbox"
                  checked={!!edit.featured}
                  onChange={(e) => setEdit({ ...edit, featured: e.target.checked })}
                  className="accent-cyber-cyan"
                />
                featured
              </label>
              <div>
                <label className="label">sort order</label>
                <input type="number" className="input" value={edit.sort_order ?? 0} onChange={(e) => setEdit({ ...edit, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <ImageUpload
              label="cover image"
              value={edit.image_url || ""}
              onChange={(v) => setEdit({ ...edit, image_url: v })}
            />
          </div>
        )}
      </Modal>
    </AdminTable>
  );
}

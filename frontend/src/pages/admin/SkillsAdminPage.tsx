import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Skill, SkillCategory } from "../../types";
import AdminTable from "../../components/AdminTable";
import Modal from "../../components/Modal";

export default function SkillsAdminPage() {
  const [cats, setCats] = useState<SkillCategory[]>([]);
  const [editCat, setEditCat] = useState<Partial<SkillCategory> | null>(null);
  const [editSkill, setEditSkill] = useState<(Partial<Skill> & { category_id?: number }) | null>(null);

  function refresh() {
    api.get<SkillCategory[]>("/api/skill-categories").then((r) => setCats(r.data));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function saveCat() {
    if (!editCat) return;
    const payload = {
      name: editCat.name || "",
      icon: editCat.icon || "",
      sort_order: editCat.sort_order ?? 0,
    };
    if (editCat.id) await api.put(`/api/skill-categories/${editCat.id}`, payload);
    else await api.post("/api/skill-categories", payload);
    setEditCat(null);
    refresh();
  }

  async function deleteCat(id: number) {
    if (!confirm("Delete this category and all skills inside it?")) return;
    await api.delete(`/api/skill-categories/${id}`);
    refresh();
  }

  async function saveSkill() {
    if (!editSkill || !editSkill.category_id) return;
    const payload = {
      category_id: editSkill.category_id,
      name: editSkill.name || "",
      level: editSkill.level ?? 50,
      icon: editSkill.icon || "",
      sort_order: editSkill.sort_order ?? 0,
    };
    if (editSkill.id) await api.put(`/api/skills/${editSkill.id}`, payload);
    else await api.post("/api/skills", payload);
    setEditSkill(null);
    refresh();
  }

  async function deleteSkill(id: number) {
    if (!confirm("Delete this skill?")) return;
    await api.delete(`/api/skills/${id}`);
    refresh();
  }

  return (
    <AdminTable
      title="skills"
      description="categories + items"
      onAdd={() => setEditCat({ name: "", icon: "", sort_order: cats.length })}
      addLabel="+ new category"
    >
      {cats.length === 0 && (
        <div className="card p-8 text-center text-slate-500 font-mono text-sm">
          no categories yet — create one to get started
        </div>
      )}
      {cats.map((cat) => (
        <div key={cat.id} className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            {cat.icon && <span className="text-xl">{cat.icon}</span>}
            <h3 className="font-mono text-cyber-cyan uppercase tracking-wider text-sm">
              {cat.name}
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              ({cat.skills.length} skills · order {cat.sort_order})
            </span>
            <div className="ml-auto flex gap-2">
              <button className="btn-ghost text-xs" onClick={() => setEditCat(cat)}>
                edit
              </button>
              <button className="btn-danger text-xs" onClick={() => deleteCat(cat.id)}>
                delete
              </button>
              <button
                className="btn-primary text-xs"
                onClick={() => setEditSkill({ category_id: cat.id, level: 50 })}
              >
                + skill
              </button>
            </div>
          </div>
          <ul className="divide-y divide-bg-border">
            {cat.skills.map((s) => (
              <li key={s.id} className="py-2 flex items-center gap-3">
                {s.icon && <span>{s.icon}</span>}
                <span className="text-slate-100 font-medium">{s.name}</span>
                <div className="flex-1 max-w-[160px] h-1.5 bg-bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-violet"
                    style={{ width: `${s.level}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-slate-500 w-10 text-right">
                  {s.level}%
                </span>
                <div className="ml-auto flex gap-2">
                  <button className="btn-ghost text-xs" onClick={() => setEditSkill(s)}>
                    edit
                  </button>
                  <button className="btn-danger text-xs" onClick={() => deleteSkill(s.id)}>
                    delete
                  </button>
                </div>
              </li>
            ))}
            {cat.skills.length === 0 && (
              <li className="py-2 text-xs font-mono text-slate-500">// no skills yet</li>
            )}
          </ul>
        </div>
      ))}

      <Modal
        open={!!editCat}
        onClose={() => setEditCat(null)}
        title={editCat?.id ? "edit category" : "new category"}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditCat(null)}>
              cancel
            </button>
            <button className="btn-primary" onClick={saveCat}>
              save
            </button>
          </>
        }
      >
        {editCat && (
          <div className="space-y-3">
            <div>
              <label className="label">name</label>
              <input
                className="input"
                value={editCat.name || ""}
                onChange={(e) => setEditCat({ ...editCat, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">icon (emoji)</label>
                <input
                  className="input"
                  value={editCat.icon || ""}
                  onChange={(e) => setEditCat({ ...editCat, icon: e.target.value })}
                />
              </div>
              <div>
                <label className="label">sort order</label>
                <input
                  type="number"
                  className="input"
                  value={editCat.sort_order ?? 0}
                  onChange={(e) =>
                    setEditCat({ ...editCat, sort_order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!editSkill}
        onClose={() => setEditSkill(null)}
        title={editSkill?.id ? "edit skill" : "new skill"}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditSkill(null)}>
              cancel
            </button>
            <button className="btn-primary" onClick={saveSkill}>
              save
            </button>
          </>
        }
      >
        {editSkill && (
          <div className="space-y-3">
            <div>
              <label className="label">category</label>
              <select
                className="input"
                value={editSkill.category_id || ""}
                onChange={(e) =>
                  setEditSkill({ ...editSkill, category_id: parseInt(e.target.value) })
                }
              >
                <option value="">— select —</option>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">name</label>
              <input
                className="input"
                value={editSkill.name || ""}
                onChange={(e) => setEditSkill({ ...editSkill, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">level: {editSkill.level ?? 50}%</label>
              <input
                type="range"
                min={0}
                max={100}
                value={editSkill.level ?? 50}
                onChange={(e) =>
                  setEditSkill({ ...editSkill, level: parseInt(e.target.value) })
                }
                className="w-full accent-cyber-cyan"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">icon (emoji)</label>
                <input
                  className="input"
                  value={editSkill.icon || ""}
                  onChange={(e) => setEditSkill({ ...editSkill, icon: e.target.value })}
                />
              </div>
              <div>
                <label className="label">sort order</label>
                <input
                  type="number"
                  className="input"
                  value={editSkill.sort_order ?? 0}
                  onChange={(e) =>
                    setEditSkill({
                      ...editSkill,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminTable>
  );
}

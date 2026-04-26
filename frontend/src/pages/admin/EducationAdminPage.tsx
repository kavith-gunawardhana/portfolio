import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Education } from "../../types";
import AdminTable from "../../components/AdminTable";
import Modal from "../../components/Modal";
import ImageUpload from "../../components/ImageUpload";
import { formatMonthYear } from "../../lib/format";

type Draft = Partial<Education>;

export default function EducationAdminPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [edit, setEdit] = useState<Draft | null>(null);

  function refresh() {
    api.get<Education[]>("/api/education").then((r) => setItems(r.data));
  }
  useEffect(refresh, []);

  async function save() {
    if (!edit || !edit.institution || !edit.degree || !edit.start_date) return;
    const payload = {
      institution: edit.institution,
      degree: edit.degree,
      field: edit.field || "",
      location: edit.location || "",
      start_date: edit.start_date,
      end_date: edit.end_date || null,
      description: edit.description || "",
      grade: edit.grade || "",
      logo_url: edit.logo_url || "",
      sort_order: edit.sort_order ?? 0,
    };
    if (edit.id) await api.put(`/api/education/${edit.id}`, payload);
    else await api.post("/api/education", payload);
    setEdit(null);
    refresh();
  }

  async function remove(id: number) {
    if (!confirm("Delete this education entry?")) return;
    await api.delete(`/api/education/${id}`);
    refresh();
  }

  return (
    <AdminTable
      title="education"
      description="degrees, exams, and self-directed paths"
      onAdd={() =>
        setEdit({
          institution: "",
          degree: "",
          start_date: new Date().toISOString().slice(0, 10),
          sort_order: items.length,
        })
      }
      addLabel="+ new education"
    >
      {items.length === 0 && (
        <div className="card p-8 text-center text-slate-500 font-mono text-sm">
          no education entries yet
        </div>
      )}
      {items.map((edu) => (
        <div key={edu.id} className="card p-5">
          <div className="flex items-start gap-3">
            {edu.logo_url ? (
              <img src={edu.logo_url} alt="" className="w-9 h-9 rounded object-cover" />
            ) : (
              <span className="w-9 h-9 rounded bg-cyber-violet/10 border border-cyber-violet/30 grid place-items-center font-mono text-cyber-violet">
                {edu.institution.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-100">{edu.degree}</div>
              <div className="text-xs text-slate-400">
                <span className="text-cyber-violet">{edu.institution}</span>
                {edu.field && ` · ${edu.field}`}
                {edu.location && ` · ${edu.location}`} ·{" "}
                {formatMonthYear(edu.start_date)} → {formatMonthYear(edu.end_date)}
                {edu.grade && ` · ${edu.grade}`}
              </div>
              {edu.description && (
                <p className="text-sm text-slate-400 whitespace-pre-line mt-2">
                  {edu.description}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost text-xs" onClick={() => setEdit(edu)}>
                edit
              </button>
              <button className="btn-danger text-xs" onClick={() => remove(edu.id)}>
                delete
              </button>
            </div>
          </div>
        </div>
      ))}

      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? "edit education" : "new education"}
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
                <label className="label">institution *</label>
                <input
                  className="input"
                  value={edit.institution || ""}
                  onChange={(e) => setEdit({ ...edit, institution: e.target.value })}
                />
              </div>
              <div>
                <label className="label">degree / programme *</label>
                <input
                  className="input"
                  value={edit.degree || ""}
                  onChange={(e) => setEdit({ ...edit, degree: e.target.value })}
                />
              </div>
              <div>
                <label className="label">field / specialisation</label>
                <input
                  className="input"
                  value={edit.field || ""}
                  onChange={(e) => setEdit({ ...edit, field: e.target.value })}
                />
              </div>
              <div>
                <label className="label">location</label>
                <input
                  className="input"
                  value={edit.location || ""}
                  onChange={(e) => setEdit({ ...edit, location: e.target.value })}
                />
              </div>
              <div>
                <label className="label">start date *</label>
                <input
                  type="date"
                  className="input"
                  value={edit.start_date || ""}
                  onChange={(e) => setEdit({ ...edit, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="label">end date (blank = present)</label>
                <input
                  type="date"
                  className="input"
                  value={edit.end_date || ""}
                  onChange={(e) => setEdit({ ...edit, end_date: e.target.value || null })}
                />
              </div>
              <div>
                <label className="label">grade / honours</label>
                <input
                  className="input"
                  placeholder="e.g. GPA 3.8 · First Class Honours"
                  value={edit.grade || ""}
                  onChange={(e) => setEdit({ ...edit, grade: e.target.value })}
                />
              </div>
              <div>
                <label className="label">sort order</label>
                <input
                  type="number"
                  className="input"
                  value={edit.sort_order ?? 0}
                  onChange={(e) =>
                    setEdit({ ...edit, sort_order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div>
              <label className="label">description</label>
              <textarea
                className="input min-h-[120px]"
                value={edit.description || ""}
                onChange={(e) => setEdit({ ...edit, description: e.target.value })}
              />
            </div>
            <ImageUpload
              label="institution logo"
              value={edit.logo_url || ""}
              onChange={(v) => setEdit({ ...edit, logo_url: v })}
            />
          </div>
        )}
      </Modal>
    </AdminTable>
  );
}

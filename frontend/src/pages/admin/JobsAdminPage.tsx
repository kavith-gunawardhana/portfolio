import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Job, Promotion } from "../../types";
import AdminTable from "../../components/AdminTable";
import Modal from "../../components/Modal";
import ImageUpload from "../../components/ImageUpload";
import { formatMonthYear } from "../../lib/format";

type JobDraft = Partial<Job>;
type PromoDraft = Partial<Promotion> & { job_id?: number };

export default function JobsAdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editJob, setEditJob] = useState<JobDraft | null>(null);
  const [editPromo, setEditPromo] = useState<PromoDraft | null>(null);

  function refresh() {
    api.get<Job[]>("/api/jobs").then((r) => setJobs(r.data));
  }
  useEffect(refresh, []);

  async function saveJob() {
    if (!editJob || !editJob.company || !editJob.title || !editJob.start_date) return;
    const payload = {
      company: editJob.company,
      title: editJob.title,
      location: editJob.location || "",
      start_date: editJob.start_date,
      end_date: editJob.end_date || null,
      description: editJob.description || "",
      logo_url: editJob.logo_url || "",
      sort_order: editJob.sort_order ?? 0,
    };
    if (editJob.id) await api.put(`/api/jobs/${editJob.id}`, payload);
    else await api.post("/api/jobs", payload);
    setEditJob(null);
    refresh();
  }

  async function deleteJob(id: number) {
    if (!confirm("Delete this job and all its promotions?")) return;
    await api.delete(`/api/jobs/${id}`);
    refresh();
  }

  async function savePromo() {
    if (!editPromo || !editPromo.job_id || !editPromo.title || !editPromo.start_date) return;
    const payload = {
      job_id: editPromo.job_id,
      title: editPromo.title,
      start_date: editPromo.start_date,
      description: editPromo.description || "",
      sort_order: editPromo.sort_order ?? 0,
    };
    if (editPromo.id) await api.put(`/api/promotions/${editPromo.id}`, payload);
    else await api.post("/api/promotions", payload);
    setEditPromo(null);
    refresh();
  }

  async function deletePromo(id: number) {
    if (!confirm("Delete this promotion?")) return;
    await api.delete(`/api/promotions/${id}`);
    refresh();
  }

  return (
    <AdminTable
      title="experience"
      description="jobs + promotions / role changes"
      onAdd={() =>
        setEditJob({
          company: "",
          title: "",
          start_date: new Date().toISOString().slice(0, 10),
          sort_order: jobs.length,
        })
      }
      addLabel="+ new job"
    >
      {jobs.length === 0 && (
        <div className="card p-8 text-center text-slate-500 font-mono text-sm">
          no jobs yet
        </div>
      )}
      {jobs.map((job) => (
        <div key={job.id} className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            {job.logo_url ? (
              <img src={job.logo_url} alt="" className="w-9 h-9 rounded object-cover" />
            ) : (
              <span className="w-9 h-9 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 grid place-items-center font-mono text-cyber-cyan">
                {job.company.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <div className="font-semibold text-slate-100">{job.title}</div>
              <div className="text-xs text-slate-400">
                <span className="text-cyber-cyan">{job.company}</span>
                {job.location && ` · ${job.location}`} ·{" "}
                {formatMonthYear(job.start_date)} → {formatMonthYear(job.end_date)}
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="btn-ghost text-xs" onClick={() => setEditJob(job)}>
                edit
              </button>
              <button className="btn-danger text-xs" onClick={() => deleteJob(job.id)}>
                delete
              </button>
              <button
                className="btn-primary text-xs"
                onClick={() =>
                  setEditPromo({
                    job_id: job.id,
                    start_date: new Date().toISOString().slice(0, 10),
                  })
                }
              >
                + promotion
              </button>
            </div>
          </div>
          {job.description && (
            <p className="text-sm text-slate-400 whitespace-pre-line mb-2">{job.description}</p>
          )}
          {job.promotions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-bg-border space-y-2">
              <div className="text-[11px] uppercase font-mono tracking-wider text-cyber-violet">
                promotions
              </div>
              {job.promotions.map((p) => (
                <div key={p.id} className="flex items-start gap-3 text-sm">
                  <div className="flex-1">
                    <div className="text-slate-100 font-medium">{p.title}</div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {formatMonthYear(p.start_date)}
                    </div>
                    {p.description && (
                      <p className="text-slate-400 text-sm mt-1 whitespace-pre-line">
                        {p.description}
                      </p>
                    )}
                  </div>
                  <button className="btn-ghost text-xs" onClick={() => setEditPromo(p)}>
                    edit
                  </button>
                  <button className="btn-danger text-xs" onClick={() => deletePromo(p.id)}>
                    delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <Modal
        open={!!editJob}
        onClose={() => setEditJob(null)}
        title={editJob?.id ? "edit job" : "new job"}
        size="lg"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditJob(null)}>cancel</button>
            <button className="btn-primary" onClick={saveJob}>save</button>
          </>
        }
      >
        {editJob && (
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label">company *</label>
                <input
                  className="input"
                  value={editJob.company || ""}
                  onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
                />
              </div>
              <div>
                <label className="label">title *</label>
                <input
                  className="input"
                  value={editJob.title || ""}
                  onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                />
              </div>
              <div>
                <label className="label">location</label>
                <input
                  className="input"
                  value={editJob.location || ""}
                  onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
                />
              </div>
              <div>
                <label className="label">sort order</label>
                <input
                  type="number"
                  className="input"
                  value={editJob.sort_order ?? 0}
                  onChange={(e) =>
                    setEditJob({ ...editJob, sort_order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <label className="label">start date *</label>
                <input
                  type="date"
                  className="input"
                  value={editJob.start_date || ""}
                  onChange={(e) => setEditJob({ ...editJob, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="label">end date (blank = present)</label>
                <input
                  type="date"
                  className="input"
                  value={editJob.end_date || ""}
                  onChange={(e) => setEditJob({ ...editJob, end_date: e.target.value || null })}
                />
              </div>
            </div>
            <div>
              <label className="label">description</label>
              <textarea
                className="input min-h-[120px]"
                value={editJob.description || ""}
                onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
              />
            </div>
            <ImageUpload
              label="company logo"
              value={editJob.logo_url || ""}
              onChange={(v) => setEditJob({ ...editJob, logo_url: v })}
            />
          </div>
        )}
      </Modal>

      <Modal
        open={!!editPromo}
        onClose={() => setEditPromo(null)}
        title={editPromo?.id ? "edit promotion" : "new promotion"}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditPromo(null)}>cancel</button>
            <button className="btn-primary" onClick={savePromo}>save</button>
          </>
        }
      >
        {editPromo && (
          <div className="space-y-3">
            <div>
              <label className="label">job</label>
              <select
                className="input"
                value={editPromo.job_id || ""}
                onChange={(e) => setEditPromo({ ...editPromo, job_id: parseInt(e.target.value) })}
              >
                <option value="">— select —</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.company} — {j.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">new title *</label>
              <input
                className="input"
                value={editPromo.title || ""}
                onChange={(e) => setEditPromo({ ...editPromo, title: e.target.value })}
              />
            </div>
            <div>
              <label className="label">date of promotion *</label>
              <input
                type="date"
                className="input"
                value={editPromo.start_date || ""}
                onChange={(e) => setEditPromo({ ...editPromo, start_date: e.target.value })}
              />
            </div>
            <div>
              <label className="label">notes</label>
              <textarea
                className="input min-h-[100px]"
                value={editPromo.description || ""}
                onChange={(e) => setEditPromo({ ...editPromo, description: e.target.value })}
              />
            </div>
          </div>
        )}
      </Modal>
    </AdminTable>
  );
}

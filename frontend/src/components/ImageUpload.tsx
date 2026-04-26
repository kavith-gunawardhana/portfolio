import { useRef, useState } from "react";
import { api } from "../lib/api";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}

export default function ImageUpload({ value, onChange, label = "image", hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(file: File) {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await api.post<{ url: string }>("/api/uploads", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(r.data.url);
    } catch (e) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setErr(msg || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-start gap-3">
        {value && (
          <img
            src={value}
            alt={label}
            className="w-16 h-16 rounded object-cover border border-bg-border bg-black/30"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.3")}
          />
        )}
        <div className="flex-1 space-y-2">
          <input
            className="input"
            placeholder="https://… or upload below"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-ghost text-xs"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              {busy ? "uploading…" : "upload file"}
            </button>
            {value && (
              <button
                type="button"
                className="btn-danger text-xs"
                onClick={() => onChange("")}
              >
                clear
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </div>
          {hint && <div className="text-[11px] font-mono text-slate-500">{hint}</div>}
          {err && <div className="text-xs font-mono text-red-400">{err}</div>}
        </div>
      </div>
    </div>
  );
}

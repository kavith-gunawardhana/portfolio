import { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
  children: ReactNode;
}

export default function AdminTable({ title, description, onAdd, addLabel = "+ new", children }: Props) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-cyber-cyan font-mono">$</span> {title}
          </h1>
          {description && <p className="text-slate-400 text-sm font-mono mt-1">// {description}</p>}
        </div>
        {onAdd && (
          <button className="btn-primary" onClick={onAdd}>
            {addLabel}
          </button>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

import { ReactNode, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
}

export default function Modal({ open, onClose, title, children, footer, size = "md" }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={
          "relative panel shadow-glow w-full max-h-[90vh] overflow-y-auto " +
          (size === "lg" ? "max-w-3xl" : "max-w-xl")
        }
      >
        <div className="flex items-center justify-between p-4 border-b border-bg-border">
          <h2 className="font-mono text-cyber-cyan text-sm uppercase tracking-wider">$ {title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-cyber-cyan font-mono text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="p-4 border-t border-bg-border flex gap-2 justify-end">{footer}</div>}
      </div>
    </div>
  );
}

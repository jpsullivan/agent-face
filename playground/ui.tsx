import type { ReactNode } from "react";

export function Section({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 sm:p-5">
      <h2 className="text-base font-semibold">{title}</h2>
      {note && <p className="mt-1 text-sm text-[var(--muted)]">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-[var(--muted)]">
      {label}
      {children}
    </label>
  );
}

export const inputClass =
  "rounded-md border border-[var(--line)] bg-[var(--page)] px-2 py-1 text-sm text-[var(--text)]";

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-sm ${
        active
          ? "border-[var(--text)] bg-[var(--text)] text-[var(--page)]"
          : "border-[var(--line)] hover:border-[var(--muted)]"
      }`}
    >
      {children}
    </button>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

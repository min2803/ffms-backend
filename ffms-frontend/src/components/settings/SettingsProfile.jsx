import { useRef } from "react";
import { Pencil, ShieldCheck } from "lucide-react";
import { SectionCard } from "../shared";

export default function SettingsProfile({ profile = {} }) {
  const fileInputRef = useRef(null);
  const { name = "", role = "", status = "", joinedDate = "", avatar = "", uid = "" } = profile;

  return (
    <SectionCard className="relative overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-[var(--color-primary)]/5 blur-[var(--blur-glow-md)]" />

      <div className="relative flex flex-col items-stretch gap-8 md:flex-row md:items-center md:gap-8">
        <div className="relative h-32 w-32 shrink-0 self-start md:self-center">
          <div className="h-full w-full overflow-hidden rounded-[var(--radius-sm)] border-4 border-[var(--color-bg-surface)] shadow-[var(--shadow-button-sm)]">
            <img src={avatar} alt={name} className="h-full w-full object-cover" />
          </div>
          <button
            type="button"
            aria-label="Edit profile photo"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 grid h-8 w-8 place-content-center rounded-[var(--radius-xs)] bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-soft)] transition hover:opacity-95"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-[30px] font-semibold leading-9 text-[var(--color-text-primary)]">
            {name}
          </h2>
          <div className="flex items-center gap-2 text-base font-medium text-[var(--color-text-secondary)]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
            <span>{role}</span>
          </div>
          <p className="pt-0.5 font-mono text-xs text-[var(--color-text-secondary)]/80">
            UID: {uid}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-role-editor-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.6px] text-[var(--color-role-editor-text)]">
              {status}
            </span>
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-bg-tint-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.6px] text-[var(--color-text-secondary)]">
              {joinedDate}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 rounded-[var(--radius-sm)] bg-[var(--color-bg-badge)] px-6 py-2.5 text-base font-semibold text-[var(--color-primary)] transition hover:opacity-90"
        >
          Edit Photo
        </button>
      </div>
    </SectionCard>
  );
}

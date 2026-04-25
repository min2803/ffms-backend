import { ChevronDown } from "lucide-react";

const ROLE_TONES = {
  Owner: {
    bgClass: "bg-[var(--color-bg-badge)]",
    textClass: "text-[var(--color-primary)]",
  },
  Admin: {
    bgClass: "bg-[var(--color-secondary)]/35",
    textClass: "text-[var(--color-state-success)]",
  },
  Member: {
    bgClass: "bg-[var(--color-role-member-bg)]",
    textClass: "text-[var(--color-role-member-text)]",
  },
  Viewer: {
    bgClass: "bg-[var(--color-bg-progress-track)]",
    textClass: "text-[var(--color-text-secondary)]",
  },
};

export default function PermissionMemberRow({ member }) {
  const tone = ROLE_TONES[member.roleLabel] || ROLE_TONES.Viewer;

  return (
    <div className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[rgba(190,199,212,0.2)] bg-[var(--color-bg-subtle)]/60 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`grid h-8 w-8 shrink-0 place-content-center rounded-full text-xs font-semibold ${tone.bgClass} ${tone.textClass}`}
        >
          {member.initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{member.name}</p>
          <p className="truncate text-[10px] text-[var(--color-text-secondary)]">
            {member.subtitle}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-[var(--radius-xs)] px-2 py-1.5 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-bg-badge)]"
      >
        {member.roleLabel}
        <ChevronDown size={14} />
      </button>
    </div>
  );
}

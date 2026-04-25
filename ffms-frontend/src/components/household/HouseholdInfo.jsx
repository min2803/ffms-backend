import { Info, PencilLine } from "lucide-react";
import { SectionCard, SectionContainer } from "../shared";

export default function HouseholdInfo({
  name,
  description,
  createdOn,
  status,
  onEdit,
}) {
  return (
    <SectionCard className="flex h-full flex-col p-6">
      <SectionContainer
        title={
          <span className="inline-flex items-center gap-2">
            <Info size={20} className="text-[var(--color-primary)]" />
            Household Info
          </span>
        }
        action={
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-[var(--radius-xs)] px-2 py-1 text-xs font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-bg-subtle)]"
          >
            <PencilLine size={14} />
            Edit
          </button>
        }
        className="mb-2"
        titleClassName="leading-7"
      />

      <div className="mb-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">
          Household Name
        </p>
        <p className="text-2xl font-bold text-[var(--color-text-primary)]">{name}</p>
      </div>

      <div className="mb-8 flex-1">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">
          Description
        </p>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] p-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">
            Created On
          </p>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {createdOn}
          </p>
        </div>
        <div className="rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] p-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">
            Status
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                status === "Active"
                  ? "bg-[var(--color-state-success)]"
                  : "bg-[var(--color-state-error)]"
              }`}
            />
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {status}
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

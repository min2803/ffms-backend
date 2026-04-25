import { Check, Search, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { PrimaryButton } from "../shared";

function SelectRow({ member, selected, onToggle }) {
  return (
    <button
      onClick={() => onToggle(member.id)}
      className={`flex w-full items-center justify-between rounded-[var(--radius-sm)] px-2 py-2 transition ${
        selected ? "bg-[var(--color-bg-subtle)]" : "hover:bg-[var(--color-bg-subtle)]/60"
      }`}
    >
      <div className="flex items-center gap-3 text-left">
        <div className="relative">
          <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full object-cover" />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{member.name}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{member.uid}</p>
        </div>
      </div>
      <span
        className={`grid h-6 w-6 place-content-center rounded-[8px] border ${
          selected
            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
            : "border-[var(--color-border-default)] bg-white text-transparent"
        }`}
      >
        <Check size={14} />
      </span>
    </button>
  );
}

export default function AddMemberModal({
  isOpen = false,
  members,
  selectedIds,
  onToggle,
  onClose,
  onSubmit,
}) {
  const selectedCount = selectedIds.length;
  
  useEffect(() => {
    if (!isOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[360px] rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border-default)] px-5 py-4">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Add Member</h2>
        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 place-content-center rounded-[var(--radius-xs)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3 py-2.5">
          <Search size={16} className="text-[var(--color-input-icon)]" />
          <input
            placeholder="Type UID"
            className="w-full bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-input-placeholder)]"
          />
        </div>

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">
            Search History
          </p>
          <div className="space-y-1">
            {members.map((member) => (
              <SelectRow
                key={member.id}
                member={member}
                selected={selectedIds.includes(member.id)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 border-t border-[var(--color-border-default)] px-5 py-4">
        <PrimaryButton onClick={onSubmit} className="w-full">
          Add Member ({selectedCount})
        </PrimaryButton>
        <p className="text-center text-[10px] font-semibold uppercase tracking-[1px] text-[var(--color-text-muted)]">
          Invitation will be sent to selected UIDs
        </p>
      </div>
      </div>
    </div>,
    document.body
  );
}

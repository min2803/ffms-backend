import { AlertCircle, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { PrimaryButton } from "../shared";
import PermissionMemberRow from "./PermissionMemberRow";

const NAME_MAX = 50;
const DESC_MAX = 255;

export default function EditHouseholdModal({
  isOpen = false,
  initialName,
  initialDescription,
  existingHouseholdNames = [],
  permissionMembers = [],
  onClose,
  onSave,
}) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    if (!isOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const normalizedName = name.trim().toLowerCase();
  const normalizedInitialName = initialName.trim().toLowerCase();
  const normalizedExistingNames = existingHouseholdNames.map((item) =>
    item.trim().toLowerCase()
  );
  const isDuplicateName =
    normalizedName !== normalizedInitialName &&
    normalizedExistingNames.includes(normalizedName);
  const isNameValid = name.trim().length >= 3 && !isDuplicateName;
  const isDescriptionValid = description.trim().length >= 20;
  const canSubmit = isNameValid && isDescriptionValid;

  const nameMessage = useMemo(() => {
    if (isDuplicateName) return "This household name already exists";
    if (name.trim().length > 0 && name.trim().length < 3) return "Household name is too short";
    return "";
  }, [isDuplicateName, name]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border-light)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-card)]">
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[var(--color-primary)]/5 blur-[var(--blur-glow-md)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[var(--color-state-success)]/5 blur-[var(--blur-glow-md)]" />

      <div className="relative flex items-center justify-between px-4 pb-3 pt-4 sm:px-6 sm:pt-5">
        <h2 className="text-3xl font-bold leading-8 text-[var(--color-text-primary)]">Edit Household</h2>
        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 place-content-center rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
        >
          <X size={18} />
        </button>
      </div>

      <div className="relative max-h-[70vh] overflow-y-auto px-4 pb-4 pt-1 sm:px-6 sm:pb-6">
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-[var(--color-text-primary)]">Household Name</label>
              <span className="text-[10px] uppercase tracking-[1px] text-[var(--color-text-secondary)]">
                {name.length}/{NAME_MAX}
              </span>
            </div>
            <div className="relative">
              <input
                value={name}
                onChange={(event) => setName(event.target.value.slice(0, NAME_MAX))}
                className={`w-full rounded-t-[var(--radius-sm)] border-b-2 bg-[var(--color-bg-subtle)] px-4 py-3 text-base text-[var(--color-text-primary)] outline-none ${
                  nameMessage ? "border-[var(--color-state-error)]" : "border-[var(--color-input-placeholder)]"
                }`}
              />
              {nameMessage && (
                <AlertCircle
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-state-error)]"
                />
              )}
            </div>
            {nameMessage && (
              <p className="mt-2 text-xs font-medium text-[var(--color-state-error)]">{nameMessage}</p>
            )}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-[var(--color-text-primary)]">Description</label>
            <span className="text-[10px] uppercase tracking-[1px] text-[var(--color-text-secondary)]">
              {description.length}/{DESC_MAX}
            </span>
          </div>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value.slice(0, DESC_MAX))}
            rows={4}
            className="w-full resize-none rounded-t-[var(--radius-sm)] border-b-2 border-[var(--color-input-placeholder)] bg-[var(--color-bg-subtle)] px-4 py-3 text-base leading-6 text-[var(--color-text-primary)] outline-none"
          />

          <section className="space-y-3 pt-1">
            <div className="flex items-center">
              <h3 className="text-sm font-semibold uppercase tracking-[0.7px] text-[var(--color-text-primary)]">
                Member Permissions
              </h3>
            </div>

            <div className="space-y-3">
              {permissionMembers.map((member) => (
                <PermissionMemberRow key={member.id} member={member} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="relative flex items-center justify-end gap-3 border-t border-[var(--color-border-light)] px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="rounded-[var(--radius-sm)] px-4 py-2.5 text-base font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
        >
          Cancel
        </button>
        <PrimaryButton
          disabled={!canSubmit}
          onClick={() => onSave({ name: name.trim(), description: description.trim() })}
          className={`min-w-40 px-8 py-3 text-base ${!canSubmit ? "pointer-events-none opacity-40" : ""}`}
        >
          Save Changes
        </PrimaryButton>
      </div>
      </div>
    </div>,
    document.body
  );
}

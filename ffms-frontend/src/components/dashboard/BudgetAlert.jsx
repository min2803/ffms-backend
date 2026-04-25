import { AlertTriangle } from "lucide-react";

/**
 * Budget warning banner with CTA button.
 *
 * @param {Object}   props
 * @param {string}   props.title       – alert heading (e.g. "Budget Warning")
 * @param {string}   props.message     – descriptive warning text
 * @param {string}   props.actionLabel – CTA button label (e.g. "Adjust Budget")
 * @param {Function} [props.onAction]  – callback when CTA is clicked
 */
export default function BudgetAlert({ title, message, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-state-warning-border)] bg-[var(--color-state-warning-bg)] px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 shrink-0 place-content-center rounded-[var(--radius-xs)] bg-rose-100 text-[var(--color-state-warning-text)]">
          <AlertTriangle size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-state-warning-text)]">{title}</p>
          <p className="text-xs text-[var(--color-state-warning-text)]/80">{message}</p>
        </div>
      </div>
      <button
        onClick={onAction}
        className="shrink-0 rounded-[var(--radius-xs)] bg-rose-600 px-4 py-2 text-xs font-semibold text-[var(--color-text-inverse)] transition hover:bg-rose-700"
      >
        {actionLabel}
      </button>
    </div>
  );
}

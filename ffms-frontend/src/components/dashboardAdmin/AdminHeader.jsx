import { Calendar, RefreshCw } from "lucide-react";

/**
 * Admin dashboard header with title, subtitle, time filter and refresh.
 *
 * @param {Object} props
 * @param {string} props.title    – main heading
 * @param {string} props.subtitle – subheading text
 */
export default function AdminHeader({
  title = "System Overview",
  subtitle = "Real-time financial performance and health metrics.",
  actions,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-text-muted">{subtitle}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {actions !== undefined ? (
          actions
        ) : (
          <>
            {/* Time range picker */}
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-radius-sm border border-border-default bg-bg-surface px-3.5 py-2 text-xs font-semibold text-text-secondary shadow-soft transition hover:bg-bg-subtle"
            >
              <Calendar size={14} />
              <span>Last 24 Hours</span>
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                className="ml-1"
              >
                <path
                  d="M1 1l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Refresh */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-radius-sm border border-border-default bg-bg-surface px-3.5 py-2 text-xs font-semibold text-text-secondary shadow-soft transition hover:bg-bg-subtle"
            >
              <RefreshCw size={14} />
              <span>Refresh Data</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

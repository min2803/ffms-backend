/**
 * AI Insights panel with insight cards and a refresh button.
 *
 * @param {Object}   props
 * @param {Array}    props.insights      – array of insight objects:
 *   {
 *     id:          string,
 *     title:       string,
 *     description: string,
 *     icon:        LucideIcon,
 *     iconBg:      string,           – Tailwind classes for icon bg (e.g. "bg-blue-50 text-blue-600")
 *     actionLabel: string|null,      – optional CTA text
 *     onAction:    Function|null,    – optional CTA callback
 *     progress:    number|null,      – optional progress bar (0-100)
 *   }
 * @param {Function} [props.onRefresh]  – callback for the "Refresh Analysis" button
 */
export default function AiInsights({ insights = [], onRefresh }) {
  return (
    <aside className="flex flex-col rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-insights)] p-5 shadow-[var(--shadow-soft)]">
      <p className="mb-4 text-lg font-bold text-[var(--color-text-primary)]">AI Insights</p>

      <div className="flex-1 space-y-3">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div key={insight.id} className="rounded-[var(--radius-sm)] bg-[var(--color-bg-surface)] p-4">
              <div className="flex items-start gap-3">
                <div className={`grid h-8 w-8 shrink-0 place-content-center rounded-[var(--radius-xs)] ${insight.iconBg}`}>
                  <Icon size={14} />
                </div>
                <div className="w-full">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{insight.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-muted)]">{insight.description}</p>

                  {/* Progress bar (optional) */}
                  {insight.progress != null && (
                    <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--color-bg-progress-track)]">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${insight.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Action link (optional) */}
                  {insight.actionLabel && (
                    <button
                      onClick={insight.onAction}
                      className="mt-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline"
                    >
                      {insight.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onRefresh}
        className="mt-4 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--color-text-muted)] transition hover:bg-[var(--color-bg-subtle)]"
      >
        Refresh Analysis
      </button>
    </aside>
  );
}

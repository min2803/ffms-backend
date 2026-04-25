/**
 * Recent Activity transaction list.
 *
 * @param {Object}   props
 * @param {Array}    props.activities  – [{ name, category, time, amount }]
 * @param {Function} [props.onViewAll] – callback for "View All" link
 */
export default function RecentActivity({ activities = [], onViewAll }) {
  return (
    <article className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-5 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-lg font-bold text-[var(--color-text-primary)]">Recent Activity</p>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
        >
          View All
        </button>
      </div>
      <div className="space-y-2.5">
        {activities.map((item) => (
          <div
            key={`${item.name}-${item.time}`}
            className="flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{item.name}</p>
              <p className="text-xs text-[var(--color-text-soft)]">
                {item.category} • {item.time}
              </p>
            </div>
            <p
              className={`text-sm font-bold ${
                item.amount > 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {item.amount > 0 ? "+" : ""}${Math.abs(item.amount).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

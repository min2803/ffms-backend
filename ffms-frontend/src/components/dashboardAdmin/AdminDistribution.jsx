import { SectionCard } from "../shared";

/**
 * Distribution — horizontal bar breakdown by transaction category.
 *
 * @param {Object} props
 * @param {Array}  props.categories – [{ id, label, value (percent), color }]
 */
export default function AdminDistribution({ categories }) {
  return (
    <SectionCard className="p-5">
      <h3 className="text-base font-bold text-text-primary">Distribution</h3>
      <p className="mb-4 text-xs text-text-muted">
        Transactions by category
      </p>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id}>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                {cat.label}
              </p>
              <p className="text-sm font-bold text-text-primary">{cat.value}%</p>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-bg-progress-track">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${cat.value}%`,
                  backgroundColor: cat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-5 text-xs font-semibold text-primary hover:text-primary-dark transition"
      >
        View Detailed Breakdown
      </button>
    </SectionCard>
  );
}

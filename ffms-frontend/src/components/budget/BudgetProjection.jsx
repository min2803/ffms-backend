export default function BudgetProjection({ projections: weeklyProjections = [] }) {
  return (
    <div className="mt-8">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Spending Projection</h3>
        <p className="text-sm text-[var(--color-text-secondary)]">Estimated end-of-month spend based on current velocity.</p>
      </div>

      <div className="flex h-64 items-end gap-4 md:gap-8 max-w-2xl">
        {weeklyProjections.map((item, idx) => (
          <div key={idx} className="flex h-full flex-1 flex-col justify-end">
            <div className={`relative w-full rounded-t-[var(--radius-sm)] ${item.isProjection ? "bg-[var(--color-bg-subtle)] border-2 border-dashed border-[#b3c7e6]" : "bg-[#f0f4fa]"}`} style={{ height: item.height }}>
              {!item.isProjection && (
                <div className="absolute bottom-0 w-full rounded-t-[var(--radius-sm)] bg-[var(--color-primary-2)]" style={{ height: "60%" }}></div>
              )}
               {!item.isProjection && idx === 2 && (
                <div className="absolute bottom-0 w-full rounded-t-[var(--radius-sm)] bg-[var(--color-primary)]" style={{ height: "100%" }}></div>
              )}
            </div>
            <div className={`mt-4 text-center text-[10px] font-bold uppercase tracking-widest ${item.isProjection ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}`}>
              {item.week}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

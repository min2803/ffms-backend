import { useMemo } from "react";

/**
 * Asset Allocation donut chart.
 *
 * @param {Object} props
 * @param {Array}  props.data – [{ label, percent, amount, color }]
 */
export default function AssetAllocation({ data = [] }) {
  const gradient = useMemo(() => {
    const segments = data.reduce(
      (acc, item) => {
        const start = acc.offset;
        const end = start + item.percent;
        acc.offset = end;
        acc.parts.push(`${item.color} ${start}% ${end}%`);
        return acc;
      },
      { offset: 0, parts: [] }
    );

    return segments.parts.join(", ");
  }, [data]);

  return (
    <article className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-5 shadow-[var(--shadow-soft)]">
      <p className="mb-4 text-lg font-bold text-[var(--color-text-primary)]">Asset Allocation</p>
      <div className="flex items-center gap-8">
        {/* Donut */}
        <div
          className="relative grid h-40 w-40 shrink-0 place-content-center rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
        >
          <div className="grid h-24 w-24 place-content-center rounded-full bg-[var(--color-bg-surface)] text-center">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Total</p>
            <p className="text-xs text-[var(--color-text-soft)]">100%</p>
          </div>
        </div>

        {/* Legend */}
        <ul className="space-y-3 text-sm">
          {data.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-[var(--color-text-secondary)]">{item.label}</span>
              <span className="font-bold text-[var(--color-text-primary)]">{item.percent}%</span>
              <span className="text-[var(--color-text-soft)]">({item.amount})</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

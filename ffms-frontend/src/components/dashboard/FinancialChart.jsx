import { useMemo } from "react";

/**
 * Financial Flow line chart with toggle tabs.
 *
 * @param {Object}   props
 * @param {string}   props.activeView     – currently selected view key (e.g. "income")
 * @param {Function} props.onViewChange   – callback when a tab is selected: (viewKey) => void
 * @param {Object}   props.dataMap        – { [viewKey]: number[] } mapping view keys to data arrays
 * @param {Array}    props.tabs           – [{ id, label }] tab definitions
 * @param {Array}    props.labels         – x-axis labels (e.g. ["JUL", "AUG", ...])
 * @param {string}   [props.title]        – chart heading
 * @param {string}   [props.subtitle]     – chart subheading
 */
export default function FinancialChart({
  activeView,
  onViewChange,
  dataMap,
  tabs,
  labels,
  title = "Financial Flow",
  subtitle = "Net cash flow performance",
}) {
  /* Chart colors from theme tokens (accessed via CSS custom props) */
  const chartColors = {
    line: "var(--color-chart-line)",
    grid: "var(--color-chart-grid)",
    label: "var(--color-text-soft)",
  };

  const { points, polyline, areaPath, chartW, chartH, padX, padY, innerW, innerH } = useMemo(() => {
    const values = dataMap[activeView] || [];
    const cW = 500;
    const cH = 200;
    const pX = 40;
    const pY = 20;
    const iW = cW - pX * 2;
    const iH = cH - pY * 2;
    const maxVal = Math.max(...values, 1);

    const pts = values.map((y, i) => ({
      x: pX + (i / Math.max(values.length - 1, 1)) * iW,
      y: pY + iH - (y / maxVal) * iH,
    }));

    const poly = pts.map((p) => `${p.x},${p.y}`).join(" ");
    const area =
      pts.length > 0
        ? `M${pts[0].x},${pY + iH} ${pts.map((p) => `L${p.x},${p.y}`).join(" ")} L${pts[pts.length - 1].x},${pY + iH} Z`
        : "";

    return { points: pts, polyline: poly, areaPath: area, chartW: cW, chartH: cH, padX: pX, padY: pY, innerW: iW, innerH: iH };
  }, [activeView, dataMap]);

  return (
    <article className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-5 shadow-[var(--shadow-soft)]">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-[var(--color-text-primary)]">{title}</p>
          <p className="text-xs text-[var(--color-text-soft)]">{subtitle}</p>
        </div>
        <div className="flex rounded-[var(--radius-xs)] border border-[var(--color-border-default)] p-0.5 text-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`rounded-md px-4 py-1.5 font-medium transition ${
                activeView === tab.id
                  ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-soft)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="mt-2">
        <svg viewBox={`0 0 ${chartW} ${chartH + 30}`} className="w-full" style={{ height: 280 }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padY + innerH * (1 - ratio);
            return <line key={i} x1={padX} y1={y} x2={chartW - padX} y2={y} stroke={chartColors.grid} strokeWidth="1" />;
          })}
          {/* Area fill */}
          <path d={areaPath} fill="url(#chartAreaGrad)" />
          <defs>
            <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-line)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--color-chart-line)" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {/* Line */}
          <polyline fill="none" stroke={chartColors.line} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points={polyline} />
          {/* Dots */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill={chartColors.line} stroke="white" strokeWidth="2" />
          ))}
          {/* X-axis labels */}
          {labels.map((m, i) => (
            <text
              key={m}
              x={padX + (i / Math.max(labels.length - 1, 1)) * innerW}
              y={chartH + 18}
              textAnchor="middle"
              fill={chartColors.label}
              fontSize="12"
              fontWeight="500"
            >
              {m}
            </text>
          ))}
        </svg>
      </div>
    </article>
  );
}

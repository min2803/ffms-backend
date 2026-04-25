import { useMemo } from "react";
import { SectionCard } from "../shared";

/**
 * System Activity Pulse — SVG line chart showing current vs average RPS.
 *
 * @param {Object} props
 * @param {Object} props.pulse – { labels: string[], current: number[], average: number[] }
 */
export default function AdminPulseChart({ pulse }) {
  const chartW = 460;
  const chartH = 200;
  const padX = 36;
  const padY = 20;
  const innerW = chartW - padX * 2;
  const innerH = chartH - padY * 2;

  const { currentPolyline, currentPoints } = useMemo(() => {
    const values = pulse.current || [];
    const maxVal = Math.max(...values, ...pulse.average, 1);

    const pts = values.map((y, i) => ({
      x: padX + (i / Math.max(values.length - 1, 1)) * innerW,
      y: padY + innerH - (y / maxVal) * innerH,
    }));

    return {
      currentPolyline: pts.map((p) => `${p.x},${p.y}`).join(" "),
      currentPoints: pts,
    };
  }, [pulse, innerW, innerH]);

  return (
    <SectionCard className="p-5">
      {/* Header */}
      <div className="mb-1 flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-text-primary">
            System Activity Pulse
          </h3>
          <p className="text-xs text-text-muted">
            Throughput measured in requests per second (RPS)
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-chart-line" />
            Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-text-soft" />
            Average
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${chartW} ${chartH + 28}`}
        className="mt-2 w-full"
        style={{ height: 220 }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padY + innerH * (1 - ratio);
          return (
            <line
              key={i}
              x1={padX}
              y1={y}
              x2={chartW - padX}
              y2={y}
              stroke="var(--color-chart-grid)"
              strokeWidth="1"
            />
          );
        })}

        {/* Area gradient */}
        <defs>
          <linearGradient id="adminPulseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-chart-line)"
              stopOpacity="0.18"
            />
            <stop
              offset="100%"
              stopColor="var(--color-chart-line)"
              stopOpacity="0.02"
            />
          </linearGradient>
        </defs>

        {/* Area fill */}
        {currentPoints.length > 0 && (
          <path
            d={`M${currentPoints[0].x},${padY + innerH} ${currentPoints.map((p) => `L${p.x},${p.y}`).join(" ")} L${currentPoints[currentPoints.length - 1].x},${padY + innerH} Z`}
            fill="url(#adminPulseGrad)"
          />
        )}

        {/* Current line */}
        <polyline
          fill="none"
          stroke="var(--color-chart-line)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={currentPolyline}
        />

        {/* Dots */}
        {currentPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="var(--color-chart-line)"
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* X-axis labels */}
        {pulse.labels.map((m, i) => (
          <text
            key={m}
            x={padX + (i / Math.max(pulse.labels.length - 1, 1)) * innerW}
            y={chartH + 16}
            textAnchor="middle"
            fill="var(--color-text-soft)"
            fontSize="11"
            fontWeight="500"
          >
            {m}
          </text>
        ))}
      </svg>
    </SectionCard>
  );
}

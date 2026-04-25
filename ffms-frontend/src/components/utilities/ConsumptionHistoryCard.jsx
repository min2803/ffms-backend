import { MoreHorizontal } from "lucide-react";
import { SectionCard } from "../shared";

function Bars({ values, className }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-0.5 px-5 pb-8">
      {values.map((value, index) => (
        <div key={index} className={`flex-1 rounded-t-[6px] ${className}`} style={{ height: `${value}%` }} />
      ))}
    </div>
  );
}

export default function ConsumptionHistoryCard({ labels, upperValues, lowerValues }) {
  return (
    <SectionCard className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Consumption History</h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Power usage measured in kWh over the last 30 days
          </p>
        </div>
        <button type="button" className="text-[var(--color-text-muted)]" aria-label="Chart options">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="mt-6 h-[250px] rounded-[var(--radius-sm)] bg-[var(--color-bg-surface)]">
        <div className="relative h-full">
          <Bars values={upperValues} className="bg-[var(--color-bg-utility-chart-top)]" />
          <Bars values={lowerValues} className="bg-[var(--color-bg-utility-chart-bottom)]" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 px-2 text-center">
        {labels.map((label) => (
          <p key={label} className="text-xs font-semibold uppercase tracking-[1px] text-[var(--color-text-muted)]">
            {label}
          </p>
        ))}
      </div>
    </SectionCard>
  );
}

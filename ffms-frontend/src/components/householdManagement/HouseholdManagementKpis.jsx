import { SectionCard } from "../shared";

export default function HouseholdManagementKpis({ kpis }) {
  return (
    <SectionCard className="p-0 overflow-hidden mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-border-default)]">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-[1.2px] text-[var(--color-text-muted)]">
              {kpi.label}
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] lg:text-3xl">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

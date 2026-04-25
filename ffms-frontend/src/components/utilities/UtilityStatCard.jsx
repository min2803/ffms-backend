import { SectionCard } from "../shared";

export default function UtilityStatCard({
  icon,
  iconTone = "bg-[var(--color-bg-subtle)] text-[var(--color-primary)]",
  title,
  value,
  unit,
  footerLabel,
  footerValue,
}) {
  const Icon = icon;

  return (
    <SectionCard className="p-6">
      <span className={`grid h-8 w-8 place-content-center rounded-[var(--radius-xs)] ${iconTone}`}>
        <Icon size={16} />
      </span>

      <p className="mt-4 text-sm text-[var(--color-text-secondary)]">{title}</p>

      <div className="mt-2 flex items-end gap-2">
        <p className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">{value}</p>
        {unit ? <p className="pb-1 text-xl text-[var(--color-text-muted)]">{unit}</p> : null}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border-default)] pt-4">
        <p className="text-xs text-[var(--color-text-muted)]">{footerLabel}</p>
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{footerValue}</p>
      </div>
    </SectionCard>
  );
}

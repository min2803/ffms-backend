/**
 * Single KPI stat card for the admin dashboard.
 *
 * @param {Object}  props
 * @param {string}  props.label       – uppercase label (e.g. "TOTAL USERS")
 * @param {string}  props.value       – formatted metric value
 * @param {import("lucide-react").LucideIcon} props.icon – Lucide icon component
 * @param {string}  props.iconBg      – Tailwind classes for the icon bg
 * @param {boolean} [props.highlighted] – renders a tinted background variant
 */
export default function AdminKpiCard({
  label,
  value,
  icon: Icon,
  iconBg = "",
  highlighted = false,
}) {
  return (
    <article
      className={`flex flex-col items-center gap-2 rounded-radius-md border px-5 py-5 text-center shadow-soft transition-shadow hover:shadow-card ${
        highlighted
          ? "border-border-default bg-bg-subtle"
          : "border-border-default bg-bg-surface"
      }`}
    >
      {/* Icon */}
      <div
        className={`grid h-10 w-10 place-content-center rounded-radius-sm ${iconBg}`}
      >
        <Icon size={20} />
      </div>

      {/* Label */}
      <p className="text-[10px] font-bold uppercase tracking-[1.2px] text-text-muted">
        {label}
      </p>

      {/* Value */}
      <p className="text-2xl font-extrabold tracking-tight text-text-primary lg:text-3xl">
        {value}
      </p>
    </article>
  );
}

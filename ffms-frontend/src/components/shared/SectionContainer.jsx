export default function SectionContainer({
  title,
  subtitle,
  action,
  className = "",
  titleClassName = "",
  children,
}) {
  return (
    <section className={className}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2
            className={`text-lg font-bold leading-7 text-[var(--color-text-primary)] ${titleClassName}`}
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

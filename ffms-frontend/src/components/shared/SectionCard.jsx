export default function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-soft)] ${className}`}
    >
      {children}
    </div>
  );
}

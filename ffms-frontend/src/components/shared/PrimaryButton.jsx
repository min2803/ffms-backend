export default function PrimaryButton({
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-inverse)] shadow-[var(--shadow-button-sm)] transition hover:opacity-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

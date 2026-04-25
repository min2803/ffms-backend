export default function NotificationItem({ item, onSelect }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`relative flex w-full items-start gap-4 px-5 py-4 text-left transition ${
        item.unread ? "bg-[var(--color-bg-subtle)]/90" : "bg-[var(--color-bg-surface)]"
      } hover:bg-[var(--color-bg-subtle)]`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-content-center rounded-full text-sm ${item.iconTone}`}
      >
        <Icon size={18} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="mb-1 flex items-start justify-between gap-3">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</span>
          <span className="whitespace-nowrap text-[10px] text-[var(--color-text-secondary)]">
            {item.time}
          </span>
        </span>
        <span className="block text-xs leading-5 text-[var(--color-text-secondary)]">{item.message}</span>
      </span>

      {item.unread ? (
        <span className="absolute right-2 top-4 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
      ) : null}
    </button>
  );
}

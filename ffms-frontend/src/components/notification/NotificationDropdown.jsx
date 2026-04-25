import { useNavigate } from "react-router-dom";
import NotificationItem from "./NotificationItem";

export default function NotificationDropdown({
  notifications,
  onMarkAllRead,
  onItemClick,
  onViewAll,
}) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    onViewAll?.();
    navigate("/notifications");
  };

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-[360px] overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border-light)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b border-[var(--color-bg-badge)] px-5 py-4">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Notifications</h3>
        <button
          type="button"
          onClick={onMarkAllRead}
          className="text-xs font-semibold text-[var(--color-primary)]"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-[365px] overflow-y-auto">
        {notifications.map((item) => (
          <NotificationItem key={item.id} item={item} onSelect={onItemClick} />
        ))}
      </div>

      <button
        type="button"
        onClick={handleViewAll}
        className="w-full bg-[var(--color-bg-subtle)] px-4 py-3 text-center text-xs font-semibold uppercase tracking-[1.2px] text-[var(--color-text-muted)]"
      >
        View All Notifications
      </button>
    </div>
  );
}

import { Bell } from "lucide-react";
import { useEffect, useRef } from "react";
import { NotificationDropdown } from "../notification";
import { useNotifications } from "../../contexts/NotificationContext";

/**
 * Dashboard header with title, subtitle, and notification bell.
 *
 * @param {Object}  props
 * @param {string}  props.title           – main heading
 * @param {string}  props.subtitle        – secondary text (can include JSX)
 * @param {number}  [props.notificationCount] – number of unread notifications (shows dot if > 0)
 */
export default function Header({
  title,
  subtitle,
  notificationCount = 0,
  titleClassName = "",
  subtitleClassName = "",
  children, // Slot cho các chức năng mở rộng của từng trang
}) {
  const {
    notifications,
    unreadCount,
    dropdownOpen,
    setDropdownOpen,
    markAllAsRead,
    markAsRead,
  } = useNotifications();
  const containerRef = useRef(null);
  const count = notificationCount || unreadCount;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [setDropdownOpen]);

  return (
    <div className="flex h-full items-center justify-between">
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight text-[var(--color-text-primary)] ${titleClassName}`}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`text-sm text-[var(--color-text-muted)] ${subtitleClassName}`}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Render các nút chức năng riêng biệt của từng trang nếu có */}
        {children && (
          <div className="hidden items-center gap-2 tablet:flex">
            {children}
          </div>
        )}

        <div className="relative" ref={containerRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="relative grid h-10 w-10 place-content-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
          >
            <Bell size={18} />
            {count > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--color-state-error)] ring-2 ring-[var(--color-bg-surface)]" />
            )}
          </button>

          {dropdownOpen ? (
            <NotificationDropdown
              notifications={notifications}
              onMarkAllRead={markAllAsRead}
              onItemClick={markAsRead}
              onViewAll={() => setDropdownOpen(false)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { SectionCard } from "../shared";

const ICON_MAP = {
  error: { icon: AlertCircle, bg: "bg-[#fce4ec]", text: "text-state-error" },
  success: {
    icon: CheckCircle2,
    bg: "bg-[#e8f5e9]",
    text: "text-state-success",
  },
  info: { icon: Info, bg: "bg-bg-subtle", text: "text-primary" },
};

/**
 * Single notification item row.
 */
function NotificationItem({ item }) {
  const config = ICON_MAP[item.type] || ICON_MAP.info;
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 py-3">
      {/* Icon */}
      <div
        className={`grid h-9 w-9 shrink-0 place-content-center rounded-full ${config.bg} ${config.text}`}
      >
        <Icon size={18} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-primary">{item.title}</p>
        <p className="mt-0.5 text-xs text-text-muted leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Time + unread dot */}
      <div className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
        <span className="text-[11px] font-medium text-text-soft">
          {item.time}
        </span>
        {item.unread && (
          <span className="h-2 w-2 rounded-full bg-state-error" />
        )}
      </div>
    </div>
  );
}

/**
 * Recent System Notifications section.
 *
 * @param {Object} props
 * @param {Array}  props.notifications – array of notification items
 */
export default function AdminNotifications({ notifications }) {
  return (
    <SectionCard className="p-5">
      {/* Section header */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-bold text-text-primary">
          Recent System Notifications
        </h3>
        <button
          type="button"
          className="text-xs font-semibold text-primary hover:text-primary-dark transition"
        >
          Mark all as read
        </button>
      </div>

      {/* Items */}
      <div className="divide-y divide-border-default">
        {notifications.map((item) => (
          <NotificationItem key={item.id} item={item} />
        ))}
      </div>

      {/* Footer */}
      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center rounded-radius-sm border border-border-default bg-bg-subtle py-2.5 text-xs font-bold uppercase tracking-wider text-text-secondary transition hover:bg-bg-tint-soft"
      >
        View All Notifications
      </button>
    </SectionCard>
  );
}

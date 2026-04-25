import { AlertTriangle, Bell, Info, UserPlus } from "lucide-react";
import { getCurrentMonthName } from "../utils/dateTime";

const currentMonth = getCurrentMonthName();

export const notificationItems = [
  {
    id: "n1",
    title: "Budget Alert",
    message: `Grocery budget has exceeded the 90% threshold for ${currentMonth}.`,
    time: "5 mins ago",
    category: "alert",
    unread: true,
    icon: AlertTriangle,
    iconTone: "bg-red-100 text-[var(--color-state-error)]",
  },
  {
    id: "n2",
    title: "Utility Warning",
    message: "Electric bill for Anderson Residence is due in 3 days.",
    time: "2 hours ago",
    category: "warning",
    unread: true,
    icon: Bell,
    iconTone: "bg-[var(--color-role-member-bg)] text-[var(--color-role-member-text)]",
  },
  {
    id: "n3",
    title: "New Feature",
    message: "You can now sync joint bank accounts directly with FFMS.",
    time: "Yesterday",
    category: "info",
    unread: true,
    icon: Info,
    iconTone: "bg-[#cfe5ff] text-[var(--color-primary)]",
  },
  {
    id: "n4",
    title: "Member Added",
    message: "Sarah Anderson was added to the household plan.",
    time: "2 days ago",
    category: "member",
    unread: false,
    icon: UserPlus,
    iconTone: "bg-[var(--color-role-viewer-bg)] text-[var(--color-text-secondary)]",
  },
];

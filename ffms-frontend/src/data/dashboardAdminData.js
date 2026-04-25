import {
  Bell,
  ChartNoAxesCombined,
  Heart,
  House,
  Settings,
  Users,
} from "lucide-react";

/* ── Admin sidebar navigation ── */
export const dashboardAdminNavItems = [
  {
    id: "admin-dashboard",
    label: "Dashboard",
    href: "/dashboard-admin",
    icon: ChartNoAxesCombined,
    active: true,
  },
  { id: "users", label: "User", href: "/dashboard-admin/users", icon: Users },
  { id: "households", label: "Household", href: "/dashboard-admin/households", icon: House },
  {
    id: "system-health",
    label: "System Health",
    href: "/dashboard-admin/system-health",
    icon: Heart,
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
];

export function getAdminNavItems(activeId) {
  return dashboardAdminNavItems.map((item) => ({
    ...item,
    active: item.id === activeId,
  }));
}

/* ── KPI stat cards ── */
export const dashboardAdminKpis = [
  {
    id: "total-users",
    label: "Total Users",
    value: "1,284,092",
    iconBg: "bg-bg-subtle text-primary",
    icon: Users,
  },
  {
    id: "total-transactions",
    label: "Total Transactions",
    value: "42.8M",
    iconBg: "bg-bg-subtle text-primary",
    icon: ChartNoAxesCombined,
  },
  {
    id: "active-households",
    label: "Active Households",
    value: "312,450",
    iconBg: "bg-[#fff3e0] text-[#e65100]",
    icon: House,
    highlighted: true,
  },
  {
    id: "system-activity",
    label: "System Activity",
    value: "94.2%",
    iconBg: "bg-[#fce4ec] text-[#c62828]",
    icon: Heart,
    highlighted: true,
  },
];

/* ── System Activity Pulse line chart ── */
export const dashboardAdminPulse = {
  labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"],
  current: [120, 180, 200, 170, 220, 200, 160],
  average: [140, 160, 180, 190, 200, 185, 170],
};

/* ── Distribution categories ── */
export const dashboardAdminDistribution = [
  { id: "p2p", label: "P2P Transfers", value: 45, color: "#00629d" },
  { id: "merchant", label: "Merchant Payments", value: 32, color: "#006c49" },
  { id: "withdrawals", label: "Withdrawals", value: 15, color: "#d97706" },
  { id: "other", label: "Other", value: 8, color: "#94a3b8" },
];

/* ── Recent system notifications ── */
export const dashboardAdminNotifications = [
  {
    id: "n1",
    type: "error",
    title: "Unauthorized access attempt detected",
    description: "IP 192.168.1.45 blocked after 5 failed attempts.",
    time: "14M AGO",
    unread: true,
  },
  {
    id: "n2",
    type: "success",
    title: "Weekly backup completed successfully",
    description: 'Volume "Admin_DB_Master" archived to Glacier storage.',
    time: "2H AGO",
    unread: false,
  },
  {
    id: "n3",
    type: "info",
    title: "System update scheduled",
    description: "Version 4.2.1 deployment window: Sunday 02:00 AM UTC.",
    time: "5H AGO",
    unread: false,
  },
];

/* ── System Health Page Data ── */
export const systemHealthLogs = [
  {
    id: "log1",
    timestamp: "2023-11-24 14:02:11.432",
    level: "CRITICAL",
    source: "auth-gateway-v2",
    message: "Socket closed unexpectedly while awaiting handshake...",
  },
  {
    id: "log2",
    timestamp: "2023-11-24 14:01:58.211",
    level: "WARNING",
    source: "db-cluster-prod",
    message: "Query execution time exceeded threshold (850ms ...",
  },
  {
    id: "log3",
    timestamp: "2023-11-24 14:01:45.003",
    level: "INFO",
    source: "cache-redis-01",
    message: "Flushing LRU cache for keyspace 'user_sessions_v...",
  },
  {
    id: "log4",
    timestamp: "2023-11-24 14:01:32.887",
    level: "ERROR",
    source: "billing-service",
    message: "Stripe API unreachable. Retrying in 5000ms. Error ...",
  },
  {
    id: "log5",
    timestamp: "2023-11-24 14:01:21.002",
    level: "INFO",
    source: "deployment-sync",
    message: "Successful canary deployment for build #8829 on ...",
  },
  {
    id: "log6",
    timestamp: "2023-11-24 14:01:10.154",
    level: "INFO",
    source: "k8s-orchestrator",
    message: "Autoscaling event: Adding 2 pods to 'front-end-clu...",
  },
];

export const systemHealthLatency = [
  60, 80, 70, 110, 150, 110, 180, 240, 140, 80, 100, 70, 90, 80, 120, 110, 160,
];

export const systemHealthHistory = [
  {
    date: "Today",
    uptime: "99.9%",
    blocks: ["healthy", "healthy", "healthy", "warning", "healthy", "healthy", "healthy", "healthy"],
  },
  {
    date: "Nov 23",
    uptime: "100.0%",
    blocks: ["healthy", "healthy", "healthy", "healthy", "healthy", "healthy", "healthy", "healthy"],
  },
  {
    date: "Nov 22",
    uptime: "94.2%",
    blocks: ["healthy", "error", "healthy", "healthy", "healthy", "healthy", "healthy", "healthy"],
  },
];

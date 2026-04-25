import { useState } from "react";
import UserLayout from "../components/layout/UserLayout";
import { Header, Sidebar } from "../components/dashboard";
import { SectionCard, SectionContainer } from "../components/shared";
import { NotificationItem } from "../components/notification";
import { useNotifications } from "../contexts/NotificationContext";
import { getNavigationItems } from "../data/navigation";

export default function NotificationPage() {
  const [sidebarCollapsed] = useState(false);
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const navItems = getNavigationItems("dashboard");

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      header={
        <Header
          title="Notifications"
          subtitle="Track alerts, updates, and member activities across your household workspace."
          notificationCount={unreadCount}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SectionCard className="overflow-hidden">
            <div className="border-b border-[var(--color-bg-badge)] px-6 py-5">
              <SectionContainer
                title="All Notifications"
                subtitle={`${notifications.length} total notifications`}
                action={
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-[var(--color-primary)]"
                  >
                    Mark all as read
                  </button>
                }
                className="mb-0"
              />
            </div>
            <div className="divide-y divide-[var(--color-bg-badge)]">
              {notifications.map((item) => (
                <NotificationItem key={item.id} item={item} onSelect={markAsRead} />
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <SectionCard className="p-6">
            <SectionContainer title="Summary" className="mb-0" />
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">
                  Unread
                </p>
                <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">{unreadCount}</p>
              </div>
              <div className="rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">
                  Total
                </p>
                <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
                  {notifications.length}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="p-6">
            <SectionContainer title="Quick Actions" className="mb-0" />
            <div className="space-y-3">
              <button
                type="button"
                onClick={markAllAsRead}
                className="w-full rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)]"
              >
                Mark everything as read
              </button>
              <button
                type="button"
                className="w-full rounded-[var(--radius-sm)] bg-[var(--color-bg-badge)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)]"
              >
                Configure notification channels
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </UserLayout>
  );
}

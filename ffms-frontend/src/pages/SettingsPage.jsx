import { useState } from "react";
import UserLayout from "../components/layout/UserLayout";
import { Sidebar, Header } from "../components/dashboard";
import { SettingsProfile, SettingsForm } from "../components/settings";
import { getNavigationItems } from "../data/navigation";
import { useNotifications } from "../contexts/NotificationContext";
import useAuth from "../hooks/useAuth";
import { userService } from "../services";

export default function SettingsPage() {
  const [sidebarCollapsed] = useState(false);
  const { unreadCount } = useNotifications();
  const { user, getMe } = useAuth(); // Assume getMe sets or has current user

  const navItems = getNavigationItems("settings");

  const handleSaveSettings = async (data) => {
    // Make call to save profile using userService and user id from auth
    if (user?.id) {
      await userService.updateProfile(user.id, data);
      await getMe(); // Refresh
    }
  };

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      header={
        <Header
          title="Settings"
          subtitle="Manage your personal identity and family group access."
          notificationCount={unreadCount}
          titleClassName="!text-[30px] !leading-9 !tracking-[-0.02em]"
          subtitleClassName="!mt-1 !text-base !text-[var(--color-text-secondary)]"
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      <div className="mx-auto w-full max-w-[1024px] space-y-8 pb-2">
        <SettingsProfile profile={user || {}} />
        <SettingsForm initialData={user || undefined} onSave={handleSaveSettings} />
      </div>
    </UserLayout>
  );
}

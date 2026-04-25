import { useState } from "react";
import UserLayout from "../components/layout/UserLayout";
import { Sidebar } from "../components/dashboard";
import { SectionCard } from "../components/shared";
import {
  UserListToolbar,
  UserListTable,
} from "../components/userManagement";
import { getAdminNavItems } from "../data/dashboardAdminData";
import useUsers from "../hooks/useUsers";

export default function UserManagementPage() {
  const [sidebarCollapsed] = useState(false);
  const { users, loading, error } = useUsers();

  // We can just construct the header directly here since it's simple
  const headerContent = (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] uppercase">
        User Management
      </h1>
      <p className="mt-1 text-sm font-medium text-[var(--color-text-secondary)]">
        Manage platform access, roles, and security status for all active personnel.
      </p>
    </div>
  );

  return (
    <UserLayout
      sidebar={
        <Sidebar
          navItems={getAdminNavItems("users")}
          collapsed={sidebarCollapsed}
          brandLabel="SYSTEM CONTROL"
        />
      }
      header={headerContent}
      sidebarCollapsed={sidebarCollapsed}
      headerContainerClassName="max-w-[1320px] pb-6"
      contentContainerClassName="max-w-[1320px]"
    >
      {/* Background container for the main content area using specific background tone from the mockup */}
      <div className="rounded-[var(--radius-lg)] bg-[var(--color-bg-subtle)] p-6 shadow-sm">
        <UserListToolbar />
        <SectionCard className="overflow-hidden border-none shadow-sm">
          {loading ? (
             <div className="py-10 text-center font-medium text-[var(--color-text-secondary)]">
               Loading users...
             </div>
          ) : error ? (
             <div className="py-10 text-center font-medium text-red-500">
               Error: {error}
             </div>
          ) : (
             <UserListTable users={users} />
          )}
        </SectionCard>
      </div>
    </UserLayout>
  );
}

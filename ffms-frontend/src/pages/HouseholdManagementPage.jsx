import { useState } from "react";
import UserLayout from "../components/layout/UserLayout";
import { Sidebar } from "../components/dashboard";
import {
  HouseholdManagementKpis,
  HouseholdListTable,
} from "../components/householdManagement";
import { getAdminNavItems } from "../data/dashboardAdminData";
import useAdminData from "../hooks/useAdminData";

export default function HouseholdManagementPage() {
  const [sidebarCollapsed] = useState(false);
  const { data, loading, error } = useAdminData("households");

  const headerContent = (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] uppercase">
        Household Management
      </h1>
      <p className="mt-1 text-sm font-medium text-[var(--color-text-secondary)]">
        Manage entity hierarchies and member access across the platform.
      </p>
    </div>
  );

  return (
    <UserLayout
      sidebar={
        <Sidebar
          navItems={getAdminNavItems("households")}
          collapsed={sidebarCollapsed}
          brandLabel="SYSTEM CONTROL"
        />
      }
      header={headerContent}
      sidebarCollapsed={sidebarCollapsed}
      headerContainerClassName="max-w-[1320px] pb-6"
      contentContainerClassName="max-w-[1320px]"
    >
      <div className="space-y-6">
        {loading ? (
             <div className="py-10 text-center font-medium text-[var(--color-text-secondary)]">
               Loading household data...
             </div>
        ) : error ? (
             <div className="py-10 text-center font-medium text-red-500">
               Error: {error}
             </div>
        ) : (
          <>
            <HouseholdManagementKpis kpis={data?.kpis || []} />
            <HouseholdListTable households={data?.households || []} />
          </>
        )}
      </div>
    </UserLayout>
  );
}

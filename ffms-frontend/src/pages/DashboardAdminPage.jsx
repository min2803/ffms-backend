import { useState } from "react";
import UserLayout from "../components/layout/UserLayout";
import { Sidebar } from "../components/dashboard";
import {
  AdminHeader,
  AdminKpiCards,
  AdminPulseChart,
  AdminDistribution,
  AdminNotifications,
} from "../components/dashboardAdmin";
import { getAdminNavItems } from "../data/dashboardAdminData";
import useAdminData from "../hooks/useAdminData";

export default function DashboardAdminPage() {
  const [sidebarCollapsed] = useState(false);
  const { data, loading, error } = useAdminData("dashboard");

  return (
    <UserLayout
      sidebar={
        <Sidebar
          navItems={getAdminNavItems("admin-dashboard")}
          collapsed={sidebarCollapsed}
          brandLabel="SYSTEM CONTROL"
        />
      }
      header={<AdminHeader />}
      sidebarCollapsed={sidebarCollapsed}
      headerContainerClassName="max-w-[1320px]"
      contentContainerClassName="max-w-[1320px]"
    >
      <div className="space-y-5">
        {loading ? (
             <div className="py-10 text-center font-medium text-[var(--color-text-secondary)]">
               Loading admin dashboard...
             </div>
        ) : error ? (
             <div className="py-10 text-center font-medium text-red-500">
               Error: {error}
             </div>
        ) : (
          <>
            {/* KPI Stats Row */}
            <AdminKpiCards cards={data?.kpis || []} />

            {/* Chart + Distribution Row */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <AdminPulseChart pulse={data?.pulse || { labels: [], current: [], average: [] }} />
              </div>
              <div className="lg:col-span-5">
                <AdminDistribution categories={data?.distribution || []} />
              </div>
            </div>

            {/* Notifications */}
            <AdminNotifications notifications={data?.notifications || []} />
          </>
        )}
      </div>
    </UserLayout>
  );
}

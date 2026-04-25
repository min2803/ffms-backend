import { useMemo, useState } from "react";
import UserLayout from "../components/layout/UserLayout";
import { Sidebar, Header } from "../components/dashboard";
import {
  ConsumptionHistoryCard,
  MeterHistoryCard,
  UtilityRecommendationCard,
  UtilityStatCard,
} from "../components/utilities";
import { Zap, Droplets } from "lucide-react";
import { getNavigationItems } from "../data/navigation";
import useUtilities from "../hooks/useUtilities";

export default function UtilitiesPage() {
  const [sidebarCollapsed] = useState(false);
  const { consumption, loading, error } = useUtilities();
  const navItems = getNavigationItems("utilities");

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      header={
        <Header title="Resource Tracking">
          {/* Chức năng riêng của Utilities: Toggle Điện/Nước */}
          <div className="flex items-center rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] p-1">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[var(--radius-xs)] bg-[var(--color-bg-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] shadow-sm"
            >
              <Zap size={14} />
              Electricity
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[var(--radius-xs)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]"
            >
              <Droplets size={14} />
              Water
            </button>
          </div>
        </Header>
      }
      sidebarCollapsed={sidebarCollapsed}
      headerContainerClassName="max-w-[1320px]"
      contentContainerClassName="max-w-[1320px]"
    >
      <div className="grid grid-cols-1 gap-4 desktop:grid-cols-12 mt-4">
        {loading ? (
          <div className="desktop:col-span-12 py-10 text-center font-medium text-[var(--color-text-secondary)]">
            Loading utilities data...
          </div>
        ) : error ? (
          <div className="desktop:col-span-12 py-10 text-center font-medium text-red-500">
            Error: {error}
          </div>
        ) : (
          <>
            <div className="space-y-4 desktop:col-span-9">
              <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
                {consumption?.topStats?.length > 0 ? (
                  consumption.topStats.map((metric) => (
                    <UtilityStatCard key={metric.id} {...metric} />
                  ))
                ) : (
                  <div className="tablet:col-span-2 desktop:col-span-3 p-6 bg-[var(--color-bg-surface)] rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] text-center text-[var(--color-text-secondary)]">
                    Chưa có dữ liệu tiêu thụ điện/nước cho kỳ này.
                  </div>
                )}
                {consumption?.recommendation && (
                  <UtilityRecommendationCard {...consumption.recommendation} />
                )}
              </div>

              <ConsumptionHistoryCard
                labels={consumption?.chartLabels || []}
                upperValues={consumption?.chartUpperBars || []}
                lowerValues={consumption?.chartLowerBars || []}
              />
            </div>

            <div className="desktop:col-span-3">
              <MeterHistoryCard items={consumption?.meterHistory || []} />
            </div>
          </>
        )}
      </div>
    </UserLayout>
  );
}

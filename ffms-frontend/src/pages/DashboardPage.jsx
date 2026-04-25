import { useState } from "react";
import {
  Lightbulb,
  Search,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import UserLayout from "../components/layout/UserLayout";
import {
  Sidebar,
  Header,
  BudgetAlert,
  KpiCards,
  FinancialChart,
  AiInsights,
  RecentActivity,
  AssetAllocation,
} from "../components/dashboard";
import { getNavigationItems } from "../data/navigation";
import { getCurrentQuarterLabel } from "../utils/dateTime";
import useDashboard from "../hooks/useDashboard";



/* ── Page Component ── */

const iconMap = {
  TrendingUp,
  TrendingDown,
  Zap,
  Lightbulb
};

function DashboardPage() {
  const [sidebarCollapsed] = useState(false);
  const [flowView, setFlowView] = useState("income");
  const { summary, loading, error } = useDashboard({ quarter: getCurrentQuarterLabel() });

  // Map icon strings to components for KPI cards
  const preparedKpiCards = summary?.kpiCards?.map(card => ({
    ...card,
    icon: iconMap[card.iconName] || Lightbulb
  })) || [];
  
  const navItems = getNavigationItems("dashboard");
  const quarterLabel = getCurrentQuarterLabel();

  const headerSubtitle = (
    <>
      Reviewing your performance for{" "}
      <span className="font-medium text-[var(--color-primary)]">{quarterLabel}</span>
    </>
  );

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      header={
        <Header
          title="Executive Dashboard"
          subtitle={headerSubtitle}
          notificationCount={1}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      <div className="w-full space-y-5">
        {loading ? (
           <div className="py-10 text-center font-medium text-[var(--color-text-secondary)]">
             Loading dashboard...
           </div>
        ) : error ? (
           <div className="py-10 text-center font-medium text-red-500">
             Error: {error}
           </div>
        ) : summary?.message ? (
           <div className="py-20 text-center space-y-4">
              <div className="text-xl font-semibold text-[var(--color-text-primary)]">{summary.message}</div>
              <p className="text-[var(--color-text-secondary)]">Bắt đầu bằng cách thêm giao dịch đầu tiên của bạn hoặc thiết lập ngân sách.</p>
           </div>
        ) : (
          <>
            {summary?.budgetWarning && (
              <BudgetAlert
                title={summary.budgetWarning.title || "Budget Warning"}
                message={summary.budgetWarning.message || ""}
                actionLabel={summary.budgetWarning.actionLabel || "Adjust"}
              />
            )}

            <KpiCards cards={preparedKpiCards} />

            {/* Grid 12 cột tự động trải rộng theo breakpoints custom */}
            <section className="grid grid-cols-1 desktop:grid-cols-12 gap-5">
              <div className="desktop:col-span-8">
                <FinancialChart
                  activeView={flowView}
                  onViewChange={setFlowView}
                  dataMap={summary?.flowData || { income: [], expense: [] }}
                  tabs={[
                    { id: "income", label: "Income" },
                    { id: "expense", label: "Expense" },
                  ]}
                  labels={summary?.months || []}
                />
              </div>
              <div className="desktop:col-span-4">
                <AiInsights insights={summary?.aiInsights || []} />
              </div>
            </section>

            <section className="grid grid-cols-1 tablet:grid-cols-2 gap-5">
              <RecentActivity activities={summary?.activities || []} />
              <AssetAllocation data={summary?.assetAllocation || []} />
            </section>
          </>
        )}
      </div>
    </UserLayout>
  );
}

export default DashboardPage;

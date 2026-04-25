import { useState } from "react";
import UserLayout from "../components/layout/UserLayout";
import { Sidebar, Header } from "../components/dashboard";
import { BudgetOverview, BudgetTable, BudgetProjection, AddBudgetModal } from "../components/budget";
import { getNavigationItems } from "../data/navigation";
import useBudget from "../hooks/useBudget";

export default function BudgetPage() {
  const [sidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentMonth = new Date().getMonth() + 1;
  const { budget, loading, error, setBudget, refetch } = useBudget(currentMonth);

  const navItems = getNavigationItems("budget");

  return (
    <>
      <UserLayout
        sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
        header={
          <Header
            title="Budget"
            subtitle="Manage your monthly allocations with architectural precision."
            notificationCount={1}
          />
        }
        sidebarCollapsed={sidebarCollapsed}
      >
        <div className="flex flex-col gap-8 pb-10">
          {loading ? (
            <div className="py-10 text-center font-medium text-[var(--color-text-secondary)]">
              Loading budget...
            </div>
          ) : error ? (
            <div className="py-10 text-center font-medium text-red-500">
              Error loading budget: {error}
            </div>
          ) : (
            <>
              <BudgetOverview budgetSummary={budget?.summary || {}} />
              <BudgetTable 
                categories={budget?.categories || []} 
                onAddClick={() => setIsModalOpen(true)} 
              />
              <BudgetProjection projections={budget?.projections || []} />
            </>
          )}
        </div>
      </UserLayout>

      <AddBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

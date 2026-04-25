import { useState } from "react";
import UserLayout from "../components/layout/UserLayout";
import { Sidebar, Header } from "../components/dashboard";
import { IncomeFilters, IncomeHistory, AddIncomeModal } from "../components/income";
import { getNavigationItems } from "../data/navigation";
import useIncome from "../hooks/useIncome";

export default function IncomePage() {
  const [sidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { incomes, loading, error } = useIncome();

  const navItems = getNavigationItems("income");

  return (
    <>
      <UserLayout
        sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
        header={
          <Header
            title="Income Management"
            subtitle="Monitor and categorize your inbound family capital"
            notificationCount={1}
          />
        }
        sidebarCollapsed={sidebarCollapsed}
      >
        <div className="flex flex-col gap-6">
          <IncomeFilters />
          {loading ? (
            <div className="py-10 text-center font-medium text-[var(--color-text-secondary)]">
              Loading income...
            </div>
          ) : error ? (
            <div className="py-10 text-center font-medium text-red-500">
              Error: {error}
            </div>
          ) : (
            <IncomeHistory 
              transactions={incomes} 
              onAddClick={() => setIsModalOpen(true)} 
            />
          )}
        </div>
      </UserLayout>

      <AddIncomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

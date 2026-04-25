import { useState } from "react";
import UserLayout from "../components/layout/UserLayout";
import { Sidebar, Header } from "../components/dashboard";
import { FamilyExpenseView } from "../components/expense";
import { getNavigationItems } from "../data/navigation";
import { getCurrentMonthYear } from "../utils/dateTime";
import useExpenses from "../hooks/useExpenses";

export default function FamilyExpensePage() {
  const [sidebarCollapsed] = useState(false);

  const navItems = getNavigationItems("expense", "expense-family");
  const monthYear = getCurrentMonthYear();
  const { expenses, loading, error } = useExpenses({ type: "family" });

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      header={
        <Header
          title="Family Expenses"
          subtitle={`Detailed architecture of your spending habits for ${monthYear}.`}
          notificationCount={1}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      {loading ? (
        <div className="py-10 text-center font-medium text-[var(--color-text-secondary)]">
          Loading family expenses...
        </div>
      ) : error ? (
        <div className="py-10 text-center font-medium text-red-500">
          Error: {error}
        </div>
      ) : (
        <FamilyExpenseView expenseData={expenses} />
      )}
    </UserLayout>
  );
}

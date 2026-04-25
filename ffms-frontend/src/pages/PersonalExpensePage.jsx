import { useState } from "react";
import UserLayout from "../components/layout/UserLayout";
import { Sidebar, Header } from "../components/dashboard";
import { PersonalExpenseView } from "../components/expense";
import { getNavigationItems } from "../data/navigation";
import { getCurrentMonthYear } from "../utils/dateTime";
import useExpenses from "../hooks/useExpenses";

export default function PersonalExpensePage() {
  const [sidebarCollapsed] = useState(false);

  const navItems = getNavigationItems("expense", "expense-personal");
  const monthYear = getCurrentMonthYear();
  const { expenses, loading, error, addExpense } = useExpenses({ type: "personal" });

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      header={
        <Header
          title="Personal Expenses"
          subtitle={`Detailed architecture of your spending habits for ${monthYear}.`}
          notificationCount={1}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      {loading ? (
        <div className="py-10 text-center font-medium text-[var(--color-text-secondary)]">
          Loading personal expenses...
        </div>
      ) : error ? (
        <div className="py-10 text-center font-medium text-red-500">
          Error: {error}
        </div>
      ) : (
        <PersonalExpenseView expenseData={expenses} onAddExpense={addExpense} />
      )}
    </UserLayout>
  );
}

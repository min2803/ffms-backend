import { useState } from "react";
import { ShoppingCart, Car, Home, LampDesk, Utensils, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import SectionCard from "../shared/SectionCard";
import PrimaryButton from "../shared/PrimaryButton";

import AddExpenseModal from "./AddExpenseModal";

const iconMap = {
  ShoppingCart,
  Car,
  Home,
  LampDesk,
  Utensils
};

export default function PersonalExpenseView({ expenseData = {}, onAddExpense }) {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const { summary = {}, allocations = [], transactions = [] } = expenseData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Total Expenditure */}
        <div className="col-span-1 lg:col-span-2 rounded-[var(--radius-lg)] bg-[var(--color-bg-sidebar)] p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Total Expenditure
          </div>
          <div className="mt-2 text-5xl font-bold text-[var(--color-text-primary)]">
            ${summary.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-8 flex gap-8 border-t border-[var(--color-border-default)] pt-6">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Fixed Cost</div>
              <div className="mt-1 text-lg font-bold text-[var(--color-text-primary)]">{formatCurrency(summary.fixed)}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Variable</div>
              <div className="mt-1 text-lg font-bold text-[var(--color-text-primary)]">{formatCurrency(summary.variable)}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Unplanned</div>
              <div className="mt-1 text-lg font-bold text-[var(--color-text-primary)]">{formatCurrency(summary.unplanned)}</div>
            </div>
          </div>
        </div>

        {/* Category Allocation */}
        <SectionCard className="p-6">
          <div className="text-sm font-bold text-[var(--color-text-primary)]">Category Allocation</div>
          <div className="mt-5 space-y-4">
            {allocations.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-semibold text-[var(--color-text-secondary)]">
                  <span>{item.category}</span>
                  <span className="text-[var(--color-text-primary)]">{formatCurrency(item.amount)}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
                  <div 
                    className={`h-full rounded-full ${idx === 0 ? "bg-[var(--color-primary)]" : idx === 1 ? "bg-orange-400" : idx === 2 ? "bg-emerald-400" : "bg-blue-400"}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full text-center text-xs font-bold text-[var(--color-primary)] hover:underline">
            View All Categories
          </button>
        </SectionCard>
      </div>

      {/* History */}
      <SectionCard className="overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Recent Transactions
          </h2>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[#f1f5f9] px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)] transition hover:bg-[#e2e8f0]">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <PrimaryButton onClick={() => setIsAddExpenseOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </PrimaryButton>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th className="px-6 py-4 font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Transaction</th>
                <th className="px-6 py-4 font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Category</th>
                <th className="px-6 py-4 text-right font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Amount</th>
                <th className="px-6 py-4 text-right font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-default)]">
              {transactions.map((tx) => {
                const IconComp = iconMap[tx.icon] || Plus;
                return (
                  <tr key={tx.id} className="bg-white transition hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-primary)]">
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--color-text-primary)]">{tx.title}</div>
                          <div className="text-[11px] text-[var(--color-text-muted)]">{tx.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 border border-orange-100">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[var(--color-text-primary)]">
                      -${Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-xs font-semibold">
                        <span className={`h-1.5 w-1.5 rounded-full ${tx.status === "Completed" ? "bg-emerald-500" : "bg-gray-400"}`} />
                        <span className={tx.status === "Completed" ? "text-emerald-700" : "text-gray-500"}>{tx.status}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-[var(--color-border-default)] px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] bg-[#f8fafc]">
            <span>Showing {transactions.length} of 124 transactions</span>
            <div className="flex gap-2">
              <button className="flex h-6 w-6 items-center justify-center rounded bg-white border border-gray-200 hover:bg-gray-50">
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded bg-white border border-gray-200 hover:bg-gray-50">
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      <AddExpenseModal isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} onSubmit={onAddExpense} />
    </div>
  );
}

import { useState } from "react";
import { Filter as FilterIcon, Plus, Lightbulb, Clapperboard, Utensils, ShoppingCart, User as UserIcon } from "lucide-react";
import SectionCard from "../shared/SectionCard";
import PrimaryButton from "../shared/PrimaryButton";

import AddExpenseModal from "./AddExpenseModal";

const iconMap = {
  Lightbulb,
  Clapperboard,
  Utensils,
  ShoppingCart
};

export default function FamilyExpenseView({ expenseData = {} }) {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const { summary = {}, members = [], categories = [], transactions = [] } = expenseData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Total Household Spending */}
        <div className="rounded-[var(--radius-lg)] bg-[#f8fafc] p-8 border border-gray-100 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Total Household Spending
          </div>
          <div className="mt-2 text-5xl font-bold text-[var(--color-text-primary)]">
            ${summary.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-8 flex gap-12">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Shared Budget</div>
              <div className="mt-1 text-xl font-bold text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] pb-1 inline-block">
                {formatCurrency(summary.sharedBudget)}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Daily Average</div>
              <div className="mt-1 text-xl font-bold text-[var(--color-text-primary)] pb-1 inline-block">
                {formatCurrency(summary.dailyAverage)}
              </div>
            </div>
          </div>
        </div>

        {/* Member Contributions */}
        <div className="rounded-[var(--radius-lg)] bg-[#f0f4f8] p-8">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Member Contributions</div>
          <div className="mt-6 flex flex-col gap-5">
            {members.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#e2e8f0] border border-white flex items-center justify-center text-gray-400">
                    {m.avatar ? <img src={m.avatar} alt={m.name} className="h-full w-full object-cover" /> : <UserIcon className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--color-text-primary)]">
                      {m.name} {m.role && <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-1">({m.role})</span>}
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)]">{m.percent}% of total</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-[var(--color-text-primary)]">
                  {formatCurrency(m.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between border-y border-[var(--color-border-default)] py-4">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)]">
            <FilterIcon className="h-3.5 w-3.5" />
            Category: All
          </button>
          <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition">
            <UserIcon className="h-3.5 w-3.5" />
            Member: All
          </button>
        </div>
        <PrimaryButton onClick={() => setIsAddExpenseOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </PrimaryButton>
      </div>

      {/* Bottom Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Spending Categories */}
        <SectionCard className="lg:col-span-4 p-6 bg-[#f4f7fb] border-none shadow-none">
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">Spending Categories</h3>
          <div className="mt-6 flex flex-col gap-6">
            {categories.map((c, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className={`block h-2 w-2 rounded-full ${c.color.replace("bg-", "bg-")}`} />
                    <span className="text-[var(--color-text-primary)]">{c.name}</span>
                  </div>
                  <span className="text-[var(--color-text-primary)]">{c.percent}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-[#e2e8f0] overflow-hidden">
                  <div className={`h-full rounded-full bg-blue-500`} style={{ width: `${c.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
          
          {/* Architecture Insight */}
          <div className="mt-8 rounded-[var(--radius-md)] bg-[#ebeef5] p-4 text-xs text-[var(--color-text-secondary)] border border-gray-200">
            <div className="font-bold text-orange-600 mb-1 flex items-center gap-1.5">
              <Lightbulb className="h-3 w-3" /> ARCHITECTURE INSIGHT
            </div>
            Groceries spending is 14% higher than Sarah's average. Consider reviewing the weekly supermarket run.
          </div>
        </SectionCard>

        {/* Transactions List */}
        <SectionCard className="lg:col-span-8 p-6 shadow-sm border-[var(--color-border-default)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">Recent Shared Transactions</h3>
            <button className="text-xs font-bold text-[var(--color-primary)] hover:underline">View All</button>
          </div>
          
          <div className="flex flex-col gap-4">
             {transactions.map((tx) => {
               const IconComp = iconMap[tx.icon] || ShoppingCart;
               const isPending = tx.status.includes("PENDING");
               
               return (
                 <div key={tx.id} className="flex items-center justify-between rounded-[var(--radius-sm)] p-3 hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                   <div className="flex items-center gap-4">
                     <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-sm)] ${isPending ? "bg-orange-50 text-orange-500" : "bg-[#f0f4fa] text-[var(--color-primary)]"}`}>
                       <IconComp className="h-5 w-5" />
                     </div>
                     <div>
                       <div className="text-sm font-bold text-[var(--color-text-primary)]">{tx.title}</div>
                       <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{tx.subtitle}</div>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-6">
                     {/* Avatars */}
                     <div className="flex -space-x-2">
                       {tx.avatars && tx.avatars.map((av, idx) => (
                          <div key={idx} className="h-6 w-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                            <img src={av} alt="avatar" className="h-full w-full object-cover" />
                          </div>
                       ))}
                     </div>
                     
                     {/* Amount & Status */}
                     <div className="text-right w-24">
                       <div className="text-sm font-bold text-[var(--color-text-primary)]">
                         -${Math.abs(tx.amount).toFixed(2)}
                       </div>
                       <div className="mt-1">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                            isPending ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {tx.status}
                          </span>
                       </div>
                     </div>
                   </div>
                 </div>
               );
             })}
          </div>
        </SectionCard>
      </div>

      <AddExpenseModal isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} />
    </div>
  );
}

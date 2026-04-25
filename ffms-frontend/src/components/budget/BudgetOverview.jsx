import { Wallet, PiggyBank, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import SectionCard from "../shared/SectionCard";
export default function BudgetOverview({ budgetSummary = {} }) {
  const { totalBudget = 0, totalUsedPercent = 0, remainingBalance = 0, projectedSavings = 0, violations = {} } = budgetSummary;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Total Monthly Budget */}
      <SectionCard className="p-6">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[#e6f0f9] text-[var(--color-primary)]">
          <Wallet className="h-5 w-5" />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Total Monthly Budget</div>
        <div className="mt-1 flex items-baseline text-3xl font-bold text-[var(--color-text-primary)]">
          {formatCurrency(totalBudget)}
        </div>
        <div className="mt-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
            <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${totalUsedPercent}%` }} />
          </div>
          <div className="mt-2 text-[11px] font-medium text-[var(--color-text-muted)]">
            {totalUsedPercent}% of total monthly limit used
          </div>
        </div>
      </SectionCard>

      {/* Remaining Balance */}
      <SectionCard className="p-6">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-emerald-50 text-emerald-600">
          <PiggyBank className="h-5 w-5" />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Remaining Balance</div>
        <div className="mt-1 flex items-baseline text-3xl font-bold text-[var(--color-text-primary)]">
          {formatCurrency(remainingBalance)}
        </div>
        <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          You are on track to save {formatCurrency(projectedSavings)}
        </div>
      </SectionCard>

      {/* Attention Required */}
      <SectionCard className="border-l-4 border-l-red-500 p-6 relative">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <div className="text-[10px] font-bold uppercase tracking-widest text-red-600">Attention Required</div>
        </div>
        <div className="mt-3 text-lg font-bold text-[var(--color-text-primary)]">
          {violations.count} Categories Over
        </div>
        <div className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {violations.message}
        </div>
        <div className="mt-5">
          <a href="#!" className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline">
            Review Violations
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </SectionCard>
    </div>
  );
}

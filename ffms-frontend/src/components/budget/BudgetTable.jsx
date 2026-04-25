import { Zap, Utensils, ShoppingBag, Plus } from "lucide-react";
import SectionCard from "../shared/SectionCard";
import PrimaryButton from "../shared/PrimaryButton";
const iconMap = {
  Zap,
  Utensils,
  ShoppingBag
};

export default function BudgetTable({ onAddClick, categories: budgetCategories = [] }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <SectionCard className="overflow-hidden mt-8">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          Category Distribution
        </h2>
        <PrimaryButton onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Budget
        </PrimaryButton>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-[#f8fafc]">
            <tr>
              <th className="px-6 py-4 font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Category</th>
              <th className="px-6 py-4 font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Budget Limit</th>
              <th className="px-6 py-4 font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Spent To Date</th>
              <th className="px-6 py-4 font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-[10px] w-64">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-default)]">
            {budgetCategories.map((cat) => {
              const IconComp = iconMap[cat.icon] || Plus;
              const isOver = cat.status === "over";
              const isWarning = cat.status === "warning";
              
              const progressBg = isOver ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-emerald-600";
              const typeColor = isOver ? "text-red-500" : "text-[var(--color-text-muted)]";
              const amountLeft = cat.limit - cat.spent;
              
              const textAmountLeft = isOver 
                 ? `-$${Math.abs(amountLeft).toFixed(2)} over`
                 : `$${amountLeft.toFixed(2)} left`;

              return (
                <tr key={cat.id} className="bg-white transition hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] ${isOver ? "bg-red-50 text-red-500" : isWarning ? "bg-orange-50 text-orange-500" : "bg-[#f0f4fa] text-[var(--color-primary)]"}`}>
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-[var(--color-text-primary)]">{cat.name}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${typeColor}`}>{cat.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-[var(--color-text-primary)]">
                    {formatCurrency(cat.limit)}
                  </td>
                  <td className={`px-6 py-4 font-bold ${isOver ? "text-red-500" : "text-[var(--color-text-primary)]"}`}>
                    {formatCurrency(cat.spent)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className={isOver ? "text-red-500" : isWarning ? "text-yellow-600" : "text-emerald-700"}>{cat.percent}%</span>
                      <span className={isOver ? "text-red-500" : isWarning ? "text-yellow-600" : "text-[var(--color-text-muted)]"}>{textAmountLeft}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
                      <div className={`h-full rounded-full ${progressBg}`} style={{ width: `${Math.min(cat.percent, 100)}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

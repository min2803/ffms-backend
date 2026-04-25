import { Plus, Banknote, Building2, Building } from "lucide-react";
import SectionCard from "../shared/SectionCard";
import PrimaryButton from "../shared/PrimaryButton";


const iconMap = {
  Banknote,
  Building2,
  Building,
};

function StatusBadge({ status }) {
  const isCompleted = status === "COMPLETED";
  const bgClass = isCompleted ? "bg-[#dcfce7]" : "bg-[#e2e8f0]";
  const textClass = isCompleted ? "text-[#166534]" : "text-[var(--color-text-secondary)]";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${bgClass} ${textClass}`}
    >
      {status}
    </span>
  );
}

export default function IncomeHistory({ onAddClick, transactions: incomeTransactions = [] }) {
  return (
    <SectionCard className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Transaction History
        </h2>
        <PrimaryButton onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Income
        </PrimaryButton>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-[var(--color-bg-sidebar)]">
            <tr>
              <th className="px-6 py-4 font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-xs">
                Source
              </th>
              <th className="px-6 py-4 font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-xs">
                Date
              </th>
              <th className="px-6 py-4 font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-xs">
                Status
              </th>
              <th className="px-6 py-4 font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-xs text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-default)] bg-white text-[var(--color-text-primary)]">
            {incomeTransactions.map((tx) => {
              const IconComp = iconMap[tx.icon] || Banknote;
              return (
                <tr key={tx.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-primary)]">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">{tx.sourceTitle}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">
                          {tx.sourceSubtitle}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-6 py-4 text-right font-bold">
                    {tx.amount}
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

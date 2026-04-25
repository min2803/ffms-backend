import { Calendar, ChevronDown, Filter, RefreshCw } from "lucide-react";

export default function IncomeFilters() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {/* Date Range Filter */}
      <div className="rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] p-6">
        <label className="mb-3 block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          Date Range
        </label>
        <div className="flex items-center gap-3">
          <div className="flex h-10 flex-1 cursor-pointer items-center justify-between rounded-[var(--radius-sm)] bg-white px-4 text-sm font-medium text-[var(--color-text-primary)] shadow-sm transition hover:bg-gray-50">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-[var(--color-text-muted)]" />
              <span>Last 30 Days</span>
            </div>
            <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[#e2e8f0] text-[var(--color-text-secondary)] transition hover:bg-[#cbd5e1]">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Income Source Filter */}
      <div className="rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] p-6">
        <label className="mb-3 block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          Income Source
        </label>
        <div className="flex items-center gap-3">
          <div className="flex h-10 flex-1 cursor-pointer items-center justify-between rounded-[var(--radius-sm)] bg-white px-4 text-sm font-medium text-[var(--color-text-primary)] shadow-sm transition hover:bg-gray-50">
            <div className="flex items-center gap-2.5">
              <Filter className="h-4 w-4 text-[var(--color-text-muted)]" />
              <span>All Sources</span>
            </div>
            <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[#e2e8f0] text-[var(--color-text-secondary)] transition hover:bg-[#cbd5e1]">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { PrimaryButton } from "../shared";

export default function UserListToolbar() {
  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left side: Search & Filter */}
      <div className="flex flex-1 items-center gap-3">
        {/* Search */}
        <div className="relative max-w-[320px] flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-input-icon)]"
            size={16}
          />
          <input
            type="text"
            placeholder="Filter by name or email..."
            className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-input-placeholder)] shadow-[var(--shadow-soft)] transition focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Roles Dropdown */}
        <div className="relative">
          <select className="appearance-none rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] py-2 pl-4 pr-10 text-sm font-semibold text-[var(--color-text-primary)] shadow-[var(--shadow-soft)] transition focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
            <option>All Roles</option>
            <option>Admin</option>
            <option>User</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-input-icon)]"
          />
        </div>

        {/* Settings Filter Button */}
        <button
          type="button"
          className="grid h-9 w-9 shrink-0 place-content-center rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* Right side: New User */}
      <PrimaryButton className="w-full sm:w-auto min-w-[120px]">
        + New User
      </PrimaryButton>
    </div>
  );
}

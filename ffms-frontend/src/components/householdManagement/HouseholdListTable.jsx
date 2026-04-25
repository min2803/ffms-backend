import { Building2, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, Home, Filter, ListFilter } from "lucide-react";
import { PrimaryButton, SectionCard } from "../shared";

export default function HouseholdListTable({ households = [] }) {
  return (
    <SectionCard className="overflow-hidden mb-6">
      {/* Container Header / Toolbar */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
        <div className="flex items-center gap-4">
          <h2 className="text-[16px] font-bold text-[var(--color-text-primary)]">
            Registered Entities
          </h2>
          <div className="flex text-[var(--color-text-secondary)] gap-2">
             {/* Filter icons */}
             <button aria-label="Filter List" className="p-1 hover:text-[var(--color-text-primary)] transition">
                <Filter size={18} />
             </button>
             <button aria-label="Sort List" className="p-1 hover:text-[var(--color-text-primary)] transition">
                <ListFilter size={18} />
             </button>
          </div>
        </div>
        <PrimaryButton className="w-full sm:w-auto min-w-[140px]">
          + New Household
        </PrimaryButton>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm text-[var(--color-text-primary)]">
          <thead>
            <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-bg-page)]/50">
              <th className="py-4 pl-6 pr-4 font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                HOUSEHOLD NAME
              </th>
              <th className="px-4 py-4 font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                OWNER
              </th>
              <th className="px-4 py-4 font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                MEMBER COUNT
              </th>
              <th className="px-4 py-4 font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                CREATED DATE
              </th>
              <th className="py-4 pl-4 pr-6 text-right font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
            {households.map((hh) => (
              <tr
                key={hh.id}
                className="group transition-colors hover:bg-[var(--color-bg-subtle)]"
              >
                <td className="py-4 pl-6 pr-4">
                  <div className="flex items-center gap-4">
                    {/* Household Icon styling */}
                    <div className="grid h-10 w-10 shrink-0 place-content-center rounded-[var(--radius-sm)] bg-[var(--color-role-viewer-bg)] text-[var(--color-primary)]">
                      {hh.tier === 'Standard Tier' ? <Building2 size={20} /> : <Home size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--color-text-primary)]">
                        {hh.name}
                      </p>
                      <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                        {hh.tier}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      className="h-7 w-7 rounded-full object-cover shadow-[var(--shadow-soft)]"
                      src={hh.ownerAvatar}
                      alt={hh.ownerName}
                    />
                    <p className="font-semibold text-[var(--color-text-primary)]">
                        {hh.ownerName}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] ${hh.customMemberBadge}`}>
                    {hh.memberCount} Members
                  </span>
                </td>
                <td className="px-4 py-4 text-[13px] font-medium text-[var(--color-text-muted)]">
                  {hh.createdDate}
                </td>
                <td className="py-4 pl-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-3 text-[var(--color-text-soft)]">
                    <button className="transition-colors hover:text-[var(--color-text-primary)]">
                      <Eye size={16} />
                    </button>
                    <button className="transition-colors hover:text-[var(--color-text-primary)]">
                      <Pencil size={16} />
                    </button>
                    <button className="transition-colors hover:text-[var(--color-state-error)]">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-[var(--color-border-default)] px-6 py-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            Showing <span className="font-bold text-[var(--color-text-primary)]">1-10</span>{" "}
            of 1,284 households
          </p>
          <div className="flex gap-2 text-[var(--color-text-muted)]">
            <button className="p-1 transition hover:text-[var(--color-text-primary)]">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 transition hover:text-[var(--color-text-primary)]">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

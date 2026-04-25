import { ChevronDown, UserPlus, Users } from "lucide-react";
import { RoleBadge, SectionCard, SectionContainer } from "../shared";

export default function MemberManagement({ members, onAddMember, onShowAll }) {
  return (
    <SectionCard className="flex h-full flex-col pt-6">
      <div className="px-6">
        <SectionContainer
          title={
            <span className="inline-flex items-center gap-2">
              <Users size={20} className="text-[var(--color-primary)]" />
              Member Management
            </span>
          }
          subtitle="Manage access roles for each member of the household."
          action={
            <button
              onClick={onAddMember}
              className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-bg-badge)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:opacity-80"
            >
              <UserPlus size={16} />
              Add Member
            </button>
          }
        />
      </div>

      <div className="w-full flex-1">
        <div className="grid grid-cols-12 gap-4 border-b border-t border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] px-6 py-3 text-[10px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">
          <div className="col-span-6">Member</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        <ul className="divide-y divide-[var(--color-border-default)] px-6">
          {members.map((member) => (
            <li key={member.id} className="grid grid-cols-12 items-center gap-4 py-4">
              <div className="col-span-6 flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">
                    {member.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {member.email}
                  </p>
                </div>
              </div>
              <div className="col-span-3">
                <RoleBadge role={member.role} />
              </div>
              <div className="col-span-3 text-right">
                {member.isOwner ? (
                  <span className="text-sm text-[var(--color-text-secondary)]">Owner</span>
                ) : (
                  <div className="flex justify-end">—</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex border-t border-[var(--color-border-default)] p-4">
        <button
          onClick={onShowAll}
          className="mx-auto flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
        >
          <ChevronDown size={14} />
          Show All 5 Members
        </button>
      </div>
    </SectionCard>
  );
}

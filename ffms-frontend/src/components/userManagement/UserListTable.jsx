import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";
import { RoleBadge } from "../shared";
import UserStatusBadge from "./UserStatusBadge";

export default function UserListTable({ users = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse text-left text-sm text-[var(--color-text-primary)]">
        <thead>
          <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-bg-page)]/50">
            <th className="py-4 pl-6 pr-4 font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              USER ID
            </th>
            <th className="px-4 py-4 font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              EMAIL ADDRESS
            </th>
            <th className="px-4 py-4 font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              ROLE
            </th>
            <th className="px-4 py-4 font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              STATUS
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
          {users.map((user) => (
            <tr
              key={user.id}
              className="group transition-colors hover:bg-[var(--color-bg-subtle)]"
            >
              <td className="py-4 pl-6 pr-4 font-bold">{user.id}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img
                    className="h-8 w-8 rounded-full object-cover shadow-[var(--shadow-soft)]"
                    src={user.avatar}
                    alt={user.name}
                  />
                  <div>
                    <p className="font-bold text-[var(--color-text-primary)]">
                      {user.email}
                    </p>
                    <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                      {user.name}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-4 py-4">
                <UserStatusBadge status={user.status} />
              </td>
              <td className="px-4 py-4 text-[13px] font-medium text-[var(--color-text-muted)]">
                {user.createdDate}
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
          Showing <span className="font-bold text-[var(--color-text-primary)]">1-3</span>{" "}
          of 152 users
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
  );
}

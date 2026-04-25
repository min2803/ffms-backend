import { ChevronLeft, ChevronRight, Search, TerminalSquare } from "lucide-react";

export default function SystemHealthEventLog({ logs = [] }) {
  const getLevelBadge = (level) => {
    switch (level) {
      case "CRITICAL":
      case "ERROR":
        return <span className="inline-flex items-center rounded-full bg-[#fce4ec] px-2 py-0.5 text-[10px] font-bold text-[#c62828]"><span className="mr-1 h-1.5 w-1.5 rounded-full bg-[#c62828]"></span>{level}</span>;
      case "WARNING":
        return <span className="inline-flex items-center rounded-full bg-[#fff3e0] px-2 py-0.5 text-[10px] font-bold text-[#e65100]"><span className="mr-1 h-1.5 w-1.5 rounded-full bg-[#e65100]"></span>{level}</span>;
      case "INFO":
      default:
        return <span className="inline-flex items-center rounded-full bg-[#e0f2f1] px-2 py-0.5 text-[10px] font-bold text-[#00897b]"><span className="mr-1 h-1.5 w-1.5 rounded-full bg-[#00897b]"></span>{level}</span>;
    }
  };

  return (
    <div className="rounded-radius-lg border border-border-default bg-[#f8f9fc] shadow-soft">
      <div className="flex items-center gap-2 border-b border-border-default p-5">
        <TerminalSquare size={18} className="text-primary" />
        <h2 className="text-sm font-bold text-text-primary">Event Log Explorer</h2>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 border-b border-border-default p-5 md:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-text-secondary uppercase tracking-wider">LOG LEVEL</label>
          <select className="w-full rounded-radius-md border border-border-default bg-white px-3 py-2 text-sm text-text-primary shadow-soft focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option>All Levels</option>
            <option>INFO</option>
            <option>WARNING</option>
            <option>ERROR</option>
            <option>CRITICAL</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-text-secondary uppercase tracking-wider">DATE RANGE</label>
          <input type="text" placeholder="mm/dd/yyyy" className="w-full rounded-radius-md border border-border-default bg-white px-3 py-2 text-sm text-text-primary shadow-soft focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-text-secondary uppercase tracking-wider">SEARCH KEYWORD</label>
          <div className="relative">
            <input type="text" placeholder="Search service name, trace ID, or error message..." className="w-full rounded-radius-md border border-border-default bg-white py-2 pl-3 pr-10 text-sm text-text-primary shadow-soft focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 rounded-radius-sm bg-primary p-1.5 text-white">
              <Search size={12} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full text-left text-sm text-text-secondary">
          <thead className="bg-[#f8f9fc] text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <tr>
              <th className="px-5 py-4 font-bold">TIMESTAMP</th>
              <th className="px-5 py-4 font-bold">LEVEL</th>
              <th className="px-5 py-4 font-bold">SOURCE</th>
              <th className="px-5 py-4 font-bold">MESSAGE</th>
              <th className="px-5 py-4 font-bold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default bg-white">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-bg-subtle transition">
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex flex-col text-[#94a3b8]">
                    <span className="text-xs">{log.timestamp.split(" ")[0]}</span>
                    <span className="font-mono text-xs">{log.timestamp.split(" ")[1]}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  {getLevelBadge(log.level)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-primary">
                  {log.source}
                </td>
                <td className="px-5 py-4 text-text-secondary">
                  {log.message}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right">
                  {/* Actions normally go here, e.g., view details */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border-default bg-white px-5 py-3">
        <span className="text-xs text-text-secondary">Showing 1-6 of 2,492 logs</span>
        <div className="flex gap-1">
          <button className="flex h-6 w-6 items-center justify-center rounded border border-border-default text-text-muted hover:bg-bg-subtle">
            <ChevronLeft size={14} />
          </button>
          <button className="flex h-6 w-6 items-center justify-center rounded border border-border-default text-text-secondary hover:bg-bg-subtle">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

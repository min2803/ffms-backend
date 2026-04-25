import { Server, Activity, Database } from "lucide-react";

export default function SystemHealthKpis() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {/* Server Status */}
      <div className="rounded-radius-lg border border-border-default bg-bg-surface p-5 shadow-soft">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-radius-md bg-[#e0f2f1] text-[#00897b]">
            <Server size={20} />
          </div>
          <div className="rounded-full bg-[#e0f2f1] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#00897b]">
            HEALTHY
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            SERVER STATUS
          </p>
          <p className="mt-1 text-3xl font-bold text-text-primary">99.98%</p>
        </div>
        <div className="mt-6 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Load</span>
            <span>42%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-default">
            <div className="h-full w-[42%] bg-[#00897b]"></div>
          </div>
        </div>
      </div>

      {/* API Health */}
      <div className="rounded-radius-lg border border-border-default bg-bg-surface p-5 shadow-soft">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-radius-md bg-[#fff3e0] text-[#fb8c00]">
            <Activity size={20} />
          </div>
          <div className="rounded-full bg-[#fff3e0] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#fb8c00]">
            WARNING
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            API HEALTH
          </p>
          <p className="mt-1 text-3xl font-bold text-text-primary">240ms</p>
        </div>
        <div className="mt-6 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Latencies</span>
          </div>
          <div className="flex h-4 items-end gap-1">
            <div className="h-[40%] flex-1 bg-[#69f0ae]"></div>
            <div className="h-[50%] flex-1 bg-[#69f0ae]"></div>
            <div className="h-[30%] flex-1 bg-[#69f0ae]"></div>
            <div className="h-[100%] flex-1 bg-[#fb8c00]"></div>
            <div className="h-[60%] flex-1 bg-[#69f0ae]"></div>
          </div>
        </div>
      </div>

      {/* DB Connections */}
      <div className="rounded-radius-lg border border-border-default bg-bg-surface p-5 shadow-soft">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-radius-md bg-[#e0f2f1] text-[#00897b]">
            <Database size={20} />
          </div>
          <div className="rounded-full bg-[#e0f2f1] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#00897b]">
            HEALTHY
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            DB CONNECTIONS
          </p>
          <p className="mt-1 text-3xl font-bold text-text-primary">1,204</p>
        </div>
        <div className="mt-6 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Active Pools</span>
            <span>98% Capacity</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-default">
            <div className="h-full w-[98%] bg-[#00897b]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

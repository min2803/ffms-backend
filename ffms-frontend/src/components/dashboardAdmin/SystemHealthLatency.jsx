export default function SystemHealthLatency({ data = [] }) {
  const max = Math.max(...data, 1); // Avoid division by zero

  return (
    <div className="rounded-radius-lg border border-border-default bg-bg-surface p-6 shadow-soft h-full flex flex-col">
      <h2 className="text-sm font-bold text-text-primary mb-6">Real-time Performance Latency</h2>
      
      <div className="flex-1 flex items-end justify-between gap-1.5 xss:gap-2 sm:gap-3 lg:gap-2 xl:gap-3">
        {data.map((value, i) => {
          const heightPercent = (value / max) * 100;
          // Highlight a specific bar like in the design
          const isHighlighted = i === 5; // e.g., the 6th element

          return (
            <div 
              key={i} 
              className={`w-full max-w-[20px] rounded-t-sm transition-all duration-300 ${
                isHighlighted ? "bg-[#0ea5e9]" : "bg-[#cbd5e1] hover:bg-[#94a3b8]"
              }`}
              style={{ height: `${heightPercent}%` }}
              title={`${value}ms`}
            />
          );
        })}
      </div>
      
      {/* X-Axis labels */}
      <div className="flex justify-between mt-4 text-xs font-semibold text-text-secondary">
        <span>14:00</span>
        <span>14:15</span>
        <span>14:30</span>
        <span>14:45</span>
      </div>
    </div>
  );
}

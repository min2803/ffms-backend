export default function SystemHealthHistory({ history = [] }) {
  const getBlockColor = (status) => {
    switch (status) {
      case "error":
        return "bg-[#c62828]";
      case "warning":
        return "bg-[#bcaaa4]"; // or orange a brown-ish color in the image for warning
      case "healthy":
      default:
        return "bg-[#006c49]";
    }
  };

  return (
    <div className="rounded-radius-lg border border-border-default bg-bg-surface p-6 shadow-soft h-full flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-bold text-text-primary mb-6">System Health History</h2>
        
        <div className="flex flex-col gap-4">
          {history.map((row, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="w-12 text-xs text-text-secondary">{row.date}</span>
              <div className="flex flex-1 gap-1">
                {row.blocks.map((block, i) => (
                  <div 
                    key={i} 
                    className={`h-6 flex-1 rounded-sm ${getBlockColor(block)}`}
                    title={block}
                  ></div>
                ))}
              </div>
              <span className={`w-12 text-right text-xs font-bold ${
                parseFloat(row.uptime) < 95 ? "text-[#c62828]" : 
                parseFloat(row.uptime) < 100 ? "text-[#006c49]" : "text-[#006c49]"
              }`}>
                {row.uptime}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-between text-xs">
        <span className="text-text-secondary">Uptime monitoring for last 30 days is above target SLA.</span>
        <a href="#" className="font-semibold text-primary hover:underline">Full Report</a>
      </div>
    </div>
  );
}

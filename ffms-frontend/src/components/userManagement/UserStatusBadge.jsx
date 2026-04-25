export default function UserStatusBadge({ status }) {
  const isDocActive = status?.toUpperCase() === "ACTIVE";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] ${
        isDocActive
          ? "bg-[#6cf8bb] text-[#00714d] shadow-[0_1px_4px_rgba(108,248,187,0.4)]"
          : "bg-[#ffd8d6] text-[#ba1a1a]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isDocActive ? "bg-[#00714d]" : "bg-[#ba1a1a]"
        }`}
      />
      {status}
    </span>
  );
}

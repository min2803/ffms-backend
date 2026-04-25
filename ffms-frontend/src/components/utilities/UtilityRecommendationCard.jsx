import { Brain } from "lucide-react";
import { SectionCard } from "../shared";

export default function UtilityRecommendationCard({ title, message, actionLabel }) {
  return (
    <SectionCard className="h-full bg-[var(--color-bg-utility-recommendation)] p-6">
      <div className="flex items-center gap-2 text-[var(--color-primary)]">
        <Brain size={16} />
        <p className="text-xs font-bold uppercase tracking-[1px]">{title}</p>
      </div>

      <p className="mt-4 text-xl leading-8 text-[var(--color-text-primary)]">{message}</p>

      <button
        type="button"
        className="mt-6 text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline"
      >
        {actionLabel}
      </button>
    </SectionCard>
  );
}

import { X, Briefcase, Calendar, Shapes, ChevronDown } from "lucide-react";
import PrimaryButton from "../shared/PrimaryButton";

export default function AddIncomeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111c2d]/40 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md rounded-[var(--radius-lg)] bg-white p-6 shadow-2xl overflow-hidden"
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Add Income</h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Enter details for the new income entry.</p>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Amount Block */}
          <div className="rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] shadow-sm border-b-2 border-[var(--color-primary)]">
            <div className="p-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Amount</label>
              <div className="mt-1 flex items-baseline text-[var(--color-text-primary)]">
                <span className="text-2xl font-bold text-[var(--color-primary)]">$</span>
                <input 
                  type="text" 
                  className="w-full bg-transparent text-4xl font-bold text-[var(--color-text-primary)] placeholder-[var(--color-text-primary)] focus:outline-none ml-2" 
                  placeholder="0.00" 
                />
              </div>
            </div>
          </div>

          {/* Income Source */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Income Source</label>
            <div className="flex items-center rounded-lg bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
              <Briefcase className="mr-2.5 h-4 w-4 text-[var(--color-text-muted)]" />
              <input 
                type="text" 
                className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none" 
                placeholder="e.g. Salary, Dividend, Bonus" 
              />
            </div>
          </div>

          {/* Date & Category Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Date</label>
              <div className="flex items-center rounded-lg bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
                <Calendar className="mr-2.5 h-4 w-4 text-[var(--color-text-muted)]" />
                <input 
                  type="text" 
                  className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none" 
                  placeholder="mm/dd/yyyy" 
                />
              </div>
            </div>
            
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Category</label>
              <div className="relative flex items-center rounded-lg bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
                <Shapes className="mr-2.5 h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                <select className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-[var(--color-text-primary)] focus:outline-none">
                  <option>Salary</option>
                  <option>Investment</option>
                  <option>Gift</option>
                  <option>Other</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-end gap-3 pt-2">
          <button 
            onClick={onClose} 
            className="rounded-[var(--radius-sm)] px-4 py-2 text-sm font-bold text-[var(--color-text-primary)] transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <PrimaryButton onClick={onClose} className="px-6">
            Save Transaction
          </PrimaryButton>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}

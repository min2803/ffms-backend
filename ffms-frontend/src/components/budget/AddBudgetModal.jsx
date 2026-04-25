import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Calendar, BellRing } from "lucide-react";
import PrimaryButton from "../shared/PrimaryButton";
import { getCurrentMonthYear } from "../../utils/dateTime";

export default function AddBudgetModal({ isOpen, onClose }) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const categoryRef = useRef(null);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState("");
  const alertRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setIsAlertOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;
  const currentMonthYear = getCurrentMonthYear();

  const categories = [
    { value: "utilities", label: "Utilities" },
    { value: "dining", label: "Dining Out" },
    { value: "shopping", label: "Shopping / Lifestyle" },
    { value: "groceries", label: "Groceries" },
  ];

  const alerts = [
    { value: "80", label: "80% of budget" },
    { value: "90", label: "90% of budget" },
    { value: "100", label: "100% of budget" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111c2d]/50 p-4 backdrop-blur-sm">
      <div
        className="flex w-full max-w-md flex-col overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[var(--color-primary)] px-6 py-4 text-white">
          <h2 className="text-base font-semibold">New Budget Allocation</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 p-6">
          {/* Budget Category */}
          <div className="relative" ref={categoryRef}>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Budget Category
            </label>
            <div
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex cursor-pointer select-none items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors hover:bg-[#e6edfa]"
            >
              <span className={`text-sm font-medium ${selectedCategory ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}>
                {selectedCategory ? categories.find(c => c.value === selectedCategory)?.label : "Select a category"}
              </span>
              <ChevronDown className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
            </div>
            {isCategoryOpen && (
              <div className="absolute left-0 right-0 top-[100%] z-10 mt-2 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-white shadow-lg animate-in fade-in slide-in-from-top-2">
                <div className="max-h-60 overflow-y-auto py-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.value}
                      onClick={() => { setSelectedCategory(cat.value); setIsCategoryOpen(false); }}
                      className={`cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--color-bg-subtle)] ${
                        selectedCategory === cat.value ? "bg-[#f0f4ff] text-[var(--color-primary)]" : "text-[var(--color-text-primary)]"
                      }`}
                    >
                      {cat.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Monthly Limit */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Monthly Limit</label>
            <div className="flex items-center rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
              <span className="mr-2 text-sm font-bold text-[var(--color-text-primary)]">$</span>
              <input
                type="text"
                className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Alert Threshold & Budget Period */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative" ref={alertRef}>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
                Alert Threshold
              </label>
              <div
                onClick={() => setIsAlertOpen(!isAlertOpen)}
                className="flex cursor-pointer select-none items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors hover:bg-[#e6edfa]"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <BellRing className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                  <span className={`truncate text-sm font-medium ${selectedAlert ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}>
                    {selectedAlert ? alerts.find(a => a.value === selectedAlert)?.label : "Target"}
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 ${isAlertOpen ? "rotate-180" : ""}`} />
              </div>
              {isAlertOpen && (
                <div className="absolute left-0 right-0 top-[100%] z-10 mt-2 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-white shadow-lg animate-in fade-in slide-in-from-top-2">
                  <div className="max-h-60 overflow-y-auto py-1">
                    {alerts.map((a) => (
                      <div
                        key={a.value}
                        onClick={() => { setSelectedAlert(a.value); setIsAlertOpen(false); }}
                        className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-subtle)] ${
                          selectedAlert === a.value ? "bg-[#f0f4ff] text-[var(--color-primary)]" : "text-[var(--color-text-primary)]"
                        }`}
                      >
                        {a.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Budget Period</label>
              <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
                <input
                  type="text"
                  className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none"
                  placeholder={currentMonthYear}
                />
                <Calendar className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="rounded-[var(--radius-sm)] px-4 py-2 text-sm font-bold text-[var(--color-text-primary)] transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <PrimaryButton onClick={onClose} className="px-6">
            Save Budget
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

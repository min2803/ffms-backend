import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Calendar } from "lucide-react";
import PrimaryButton from "../shared/PrimaryButton";
import categoryService from "../../services/modules/categoryService";

export default function AddExpenseModal({ isOpen, onClose, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const categoryRef = useRef(null);

  // Fetch categories from API
  useEffect(() => {
    if (!isOpen) return;
    categoryService
      .getCategories()
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.data ?? [];
        // Chỉ lấy expense categories
        setCategories(list.filter((c) => c.type?.toLowerCase() === "expense"));
      })
      .catch(() => setCategories([]));
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset form khi mở modal
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setSelectedCategory("");
      setExpenseDate(new Date().toISOString().split("T")[0]);
      setDescription("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    // Validate
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (!selectedCategory) {
      setError("Please select a category");
      return;
    }
    if (!expenseDate) {
      setError("Please select a date");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await onSubmit({
        categoryId: parseInt(selectedCategory),
        amount: parseFloat(amount),
        description: description.trim() || null,
        expenseDate,
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to save expense");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111c2d]/50 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md rounded-[var(--radius-lg)] bg-white shadow-2xl overflow-hidden flex flex-col"
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        {/* Header (Blue Background) */}
        <div className="flex items-center justify-between bg-[var(--color-primary)] px-6 py-4 text-white">
          <h2 className="text-base font-semibold">New Expense</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-6 space-y-5">
          {/* Error */}
          {error && (
            <div className="rounded-[var(--radius-sm)] bg-red-50 border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Transaction Amount */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Transaction Amount</label>
            <div className="flex items-center rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
              <span className="mr-2 text-sm font-bold text-[var(--color-text-primary)]">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Expense Category */}
          <div className="relative" ref={categoryRef}>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Expense Category
            </label>
            <div 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex cursor-pointer select-none items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors hover:bg-[#e6edfa]"
            >
              <span className={`text-sm font-medium ${selectedCategory ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}>
                {selectedCategory ? categories.find(c => String(c.id) === String(selectedCategory))?.name : "Select a category"}
              </span>
              <ChevronDown className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
            </div>

            {/* Custom Dropdown Menu */}
            {isCategoryOpen && (
              <div className="absolute top-[100%] left-0 right-0 z-10 mt-2 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-white shadow-lg animate-in fade-in slide-in-from-top-2">
                <div className="max-h-60 overflow-y-auto py-1">
                  {categories.length === 0 ? (
                    <div className="px-4 py-2.5 text-sm text-[var(--color-text-muted)]">No categories available</div>
                  ) : (
                    categories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(String(cat.id));
                          setIsCategoryOpen(false);
                        }}
                        className={`cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--color-bg-subtle)] ${
                          String(selectedCategory) === String(cat.id)
                            ? "bg-[#f0f4ff] text-[var(--color-primary)]"
                            : "text-[var(--color-text-primary)]"
                        }`}
                      >
                        {cat.name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Transaction Date */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Transaction Date</label>
            <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none"
              />
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Optional Note</label>
            <div className="flex rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none resize-none"
                placeholder="What was this for?"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-[var(--radius-sm)] px-4 py-2 text-sm font-bold text-[var(--color-text-primary)] transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <PrimaryButton onClick={handleSubmit} disabled={submitting} className="px-6">
            {submitting ? "Saving..." : "Save Expense"}
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

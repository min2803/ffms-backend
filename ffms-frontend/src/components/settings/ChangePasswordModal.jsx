import { useState } from "react";
import { X, Lock, Key, Eye, EyeOff } from "lucide-react";
import PrimaryButton from "../shared/PrimaryButton";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validatePasswordForm = () => {
    const nextErrors = {};

    if (!form.currentPassword.trim()) {
      nextErrors.currentPassword = "Current password is required.";
    }

    if (!form.newPassword) {
      nextErrors.newPassword = "New password is required.";
    } else if (form.newPassword.length < 8) {
      nextErrors.newPassword = "New password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(form.newPassword) || !/[a-z]/.test(form.newPassword) || !/\d/.test(form.newPassword)) {
      nextErrors.newPassword = "Use upper, lower letters and at least one number.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your new password.";
    } else if (form.confirmPassword !== form.newPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleClose = () => {
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    onClose();
  };

  const handleUpdatePassword = () => {
    if (!validatePasswordForm()) return;
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111c2d]/50 backdrop-blur-sm">
      <div
        className="flex w-full max-w-md flex-col overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header (Blue Background) */}
        <div className="flex items-center justify-between bg-[var(--color-primary)] px-6 py-4 text-white">
          <h2 className="text-base font-semibold">Change Password</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 p-6 pb-2">
          {/* Current Password */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Current Password
            </label>
            <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
              <div className="flex w-full items-center">
                <Lock className="mr-2.5 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                <input
                  type={showCurrent ? "text" : "password"}
                  className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none"
                  placeholder="Enter current password"
                  value={form.currentPassword}
                  onChange={handleFieldChange("currentPassword")}
                />
              </div>
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">
                {showCurrent ? <EyeOff className="h-4 w-4 shrink-0" /> : <Eye className="h-4 w-4 shrink-0" />}
              </button>
            </div>
            {errors.currentPassword ? (
              <p className="mt-2 text-xs text-red-500">{errors.currentPassword}</p>
            ) : null}
          </div>

          <div className="h-px w-full bg-[var(--color-border-light)] my-2"></div>

          {/* New Password */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
              New Password
            </label>
            <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
              <div className="flex w-full items-center">
                <Key className="mr-2.5 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                <input
                  type={showNew ? "text" : "password"}
                  className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none"
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={handleFieldChange("newPassword")}
                />
              </div>
              <button type="button" onClick={() => setShowNew(!showNew)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">
                {showNew ? <EyeOff className="h-4 w-4 shrink-0" /> : <Eye className="h-4 w-4 shrink-0" />}
              </button>
            </div>
            {errors.newPassword ? (
              <p className="mt-2 text-xs text-red-500">{errors.newPassword}</p>
            ) : (
              <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">Must be at least 8 characters long.</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Confirm New Password
            </label>
            <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
              <div className="flex w-full items-center">
                <Key className="mr-2.5 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                <input
                  type={showConfirm ? "text" : "password"}
                  className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={handleFieldChange("confirmPassword")}
                />
              </div>
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">
                {showConfirm ? <EyeOff className="h-4 w-4 shrink-0" /> : <Eye className="h-4 w-4 shrink-0" />}
              </button>
            </div>
            {errors.confirmPassword ? (
              <p className="mt-2 text-xs text-red-500">{errors.confirmPassword}</p>
            ) : null}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-[var(--radius-sm)] px-4 py-2 text-sm font-bold text-[var(--color-text-primary)] transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <PrimaryButton onClick={handleUpdatePassword} className="px-6">
            Update Password
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { User, Shield, Lock, ChevronRight } from "lucide-react";
import { personalInfoData as defaultPersonalInfo, genderOptions as defaultGenderOptions } from "../../data/settingsData";
import { SectionCard } from "../shared";
import PrimaryButton from "../shared/PrimaryButton";
import ChangePasswordModal from "./ChangePasswordModal";
import SettingsSectionHeading from "./SettingsSectionHeading";
import { SettingsTextField, SettingsSelectField } from "./SettingsFormFields";

export default function SettingsForm({ initialData, genderOptions = defaultGenderOptions, onSave }) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const personalInfoData = initialData || defaultPersonalInfo;
  const [form, setForm] = useState({ ...personalInfoData });
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState("");

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSaveMessage("");
  };

  const handleDiscard = () => {
    setForm({ ...personalInfoData });
    setErrors({});
    setSaveMessage("");
  };

  const validatePhone = (phone) => {
    const normalized = phone.replace(/[^\d+]/g, "");
    return /^\+?\d{10,15}$/.test(normalized);
  };

  const validateDob = (dob) => {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dob.trim());
    if (!match) return false;

    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(year, month - 1, day);
    const isValidDate =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;

    return isValidDate && date <= new Date();
  };

  const validatePersonalInfo = () => {
    const nextErrors = {};

    if (!form.gender || form.gender === "prefer_not") {
      nextErrors.gender = "Please select a valid gender.";
    }

    if (!validatePhone(form.phone)) {
      nextErrors.phone = "Please enter a valid phone number.";
    }

    if (!validateDob(form.dob)) {
      nextErrors.dob = "Please enter a valid date of birth (MM/DD/YYYY).";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validatePersonalInfo()) return;
    try {
      if (onSave) {
        await onSave(form);
      }
      setSaveMessage("Saved");
    } catch (err) {
      setSaveMessage("Error saving changes");
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <SettingsSectionHeading icon={User} title="Personal Information" />
        <div className="rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <SettingsTextField
              id="settings-full-name"
              label="Full name"
              value={form.fullName}
              onChange={handleChange("fullName")}
              autoComplete="name"
            />
            <SettingsSelectField
              id="settings-gender"
              label="Gender"
              value={form.gender}
              onChange={handleChange("gender")}
              error={errors.gender}
            >
              {genderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </SettingsSelectField>
            <SettingsTextField
              id="settings-phone"
              label="Phone number"
              value={form.phone}
              onChange={handleChange("phone")}
              autoComplete="tel"
              error={errors.phone}
            />
            <SettingsTextField
              id="settings-dob"
              label="Date of birth"
              value={form.dob}
              onChange={handleChange("dob")}
              placeholder="MM/DD/YYYY"
              autoComplete="bday"
              error={errors.dob}
            />
          </div>
        </div>
      </section>

      <section>
        <SettingsSectionHeading icon={Shield} title="Account Security" />
        <SectionCard className="overflow-hidden shadow-[var(--shadow-soft)]">
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-[var(--color-bg-subtle)]/60"
          >
            <span className="flex items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-content-center rounded-full bg-[var(--color-bg-tint-soft)] text-[var(--color-primary)]">
                <Lock className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-base font-semibold text-[var(--color-text-primary)]">
                  Change Password
                </span>
                <span className="mt-0.5 block text-sm text-[var(--color-text-secondary)]">
                  Update your account password regularly for security
                </span>
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
          </button>
        </SectionCard>
      </section>

      <div className="flex flex-col-reverse items-stretch justify-end gap-4 border-t border-[var(--color-border-light)] pt-8 sm:flex-row">
        <button
          type="button"
          onClick={handleDiscard}
          className="rounded-[var(--radius-sm)] bg-[var(--color-bg-badge)] px-8 py-3 text-base font-semibold text-[var(--color-text-primary)] transition hover:opacity-90"
        >
          Discard
        </button>
        <PrimaryButton type="button" onClick={handleSaveChanges} className="px-8 py-3 text-base">
          Save Changes
        </PrimaryButton>
      </div>
      {saveMessage ? (
        <p className="text-right text-sm font-semibold text-emerald-600">{saveMessage}</p>
      ) : null}

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </div>
  );
}

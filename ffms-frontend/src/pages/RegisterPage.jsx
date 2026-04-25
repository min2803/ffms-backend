import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentYear } from "../utils/dateTime";
import useAuth from "../hooks/useAuth";

function getPasswordScore(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function getStrengthLabel(score) {
  if (score <= 1) return "Weak";
  if (score <= 2) return "Medium";
  if (score === 3) return "Strong";
  return "Very Strong";
}

function RegisterPage() {
  const currentYear = getCurrentYear();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { register, loading, error: authError } = useAuth();

  const passwordScore = useMemo(() => getPasswordScore(password), [password]);
  const strengthLabel = getStrengthLabel(passwordScore);
  const showPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (trimmedName.length < 2) {
      nextErrors.fullName = "Please enter your full name";
    }

    if (!emailRegex.test(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      register({ name: trimmedName, email: trimmedEmail, password })
        .then(() => {
          navigate("/login", { state: { successMessage: "Created successfully. Please log in." } });
        })
        .catch((err) => {
          setFieldErrors({ api: err?.response?.data?.message || "Registration failed" });
        });
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-subtle)]">
      <main className="flex min-h-[calc(100vh-120px)] items-center justify-center p-6">
        <div className="w-full max-w-[480px]">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 grid h-12 w-12 place-content-center rounded-[var(--radius-sm)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] shadow-[var(--shadow-button-sm)]">
              <span className="text-[var(--color-text-inverse)]">A</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Join the ecosystem of financial clarity
            </p>
          </div>

          <div className="rounded-[var(--radius-sm)] bg-[var(--color-bg-surface)] p-8 shadow-[var(--shadow-card)]">
            <div className="rounded-[var(--radius-xs)] bg-[var(--color-bg-subtle)] p-1">
              <div className="grid grid-cols-2 gap-1">
                <Link
                  to="/login"
                  className="rounded-[6px] py-2 text-center text-sm font-semibold text-[var(--color-text-muted)]"
                >
                  Login
                </Link>
                <button className="rounded-[6px] bg-[var(--color-bg-surface)] py-2 text-sm font-semibold text-[var(--color-primary)] shadow-[var(--shadow-soft)]">
                  Register
                </button>
              </div>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-[var(--color-text-secondary)]">
                  Full Name
                </label>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="John Doe"
                  className="mt-1.5 w-full rounded-[var(--radius-xs)] border border-transparent border-b-2 bg-[var(--color-bg-subtle)] px-4 py-3.5 text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-input-placeholder)] outline-none"
                />
                {fieldErrors.fullName && (
                  <p className="mt-1 text-xs text-[var(--color-state-error)]">{fieldErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-[var(--color-text-secondary)]">
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  className="mt-1.5 w-full rounded-[var(--radius-xs)] border border-transparent border-b-2 bg-[var(--color-bg-subtle)] px-4 py-3.5 text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-input-placeholder)] outline-none"
                />
                {fieldErrors.email && <p className="mt-1 text-xs text-[var(--color-state-error)]">{fieldErrors.email}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-[var(--color-text-secondary)]">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="password123"
                    className="mt-1.5 w-full rounded-[var(--radius-xs)] border border-transparent border-b-2 bg-[var(--color-bg-subtle)] px-4 py-3 text-base text-[var(--color-text-primary)] outline-none"
                  />
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs text-[var(--color-state-error)]">{fieldErrors.password}</p>
                  )}
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-[var(--color-text-secondary)]">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="password321"
                    className={`mt-1.5 w-full rounded-[var(--radius-xs)] border border-transparent border-b-2 bg-[var(--color-bg-subtle)] px-4 py-3 text-base text-[var(--color-text-primary)] outline-none ${
                      showPasswordMismatch || fieldErrors.confirmPassword
                        ? "border-[var(--color-state-error)]"
                        : ""
                    }`}
                  />
                </div>
              </div>

              {(showPasswordMismatch || fieldErrors.confirmPassword) && (
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-state-error)]">
                  <AlertCircle size={12} />
                  <span>Passwords do not match</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase text-[var(--color-text-secondary)]">
                  Strength: {strengthLabel}
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((bar) => (
                    <span
                      key={bar}
                      className={`h-1 w-8 rounded-full ${
                        bar <= passwordScore ? "bg-[var(--color-state-success)]" : "bg-[var(--color-input-placeholder)]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {fieldErrors.api && (
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-state-error)]">
                  <AlertCircle size={12} />
                  <span>{fieldErrors.api}</span>
                </div>
              )}
              {authError && (
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-state-error)]">
                  <AlertCircle size={12} />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[var(--radius-sm)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] py-4 text-base font-bold text-[var(--color-text-inverse)] shadow-[var(--shadow-button-sm)] disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>

          <p className="mx-auto mt-6 max-w-[360px] text-center text-xs text-[var(--color-text-secondary)]">
            By creating an account, you agree to our{" "}
            <a href="#!" className="font-semibold text-[var(--color-primary)]">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#!" className="font-semibold text-[var(--color-primary)]">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>

      <footer className="border-t border-[var(--color-border-light)] bg-[var(--color-bg-footer)] py-12">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-12 text-[11px] font-semibold uppercase tracking-[0.55px] text-[var(--color-text-muted)]">
          <p>© {currentYear} Architect Financial Group. All rights reserved.</p>
          <div className="flex gap-8 opacity-80">
            <a href="#!">Terms of Service</a>
            <a href="#!">Privacy Policy</a>
            <a href="#!">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default RegisterPage;

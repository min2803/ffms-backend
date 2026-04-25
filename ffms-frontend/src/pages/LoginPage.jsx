import { useState } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentYear } from "../utils/dateTime";
import useAuth from "../hooks/useAuth";

function LoginPage() {
  const currentYear = getCurrentYear();
  const location = useLocation();
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const successMessage = location.state?.successMessage ?? "";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !password) {
      setLoginError("Invalid email or password");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setLoginError("Invalid email or password");
      return;
    }

    try {
      setLoginError("");
      const response = await login({ email: trimmedEmail, password });

      // Chuyển hướng theo role từ API response
      const role = response?.user?.role || response?.role;
      if (role === "admin") {
        navigate("/dashboard-admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setLoginError(
        err?.response?.data?.message || "Invalid email or password"
      );
    }
  };

  const displayError = loginError || authError;

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-subtle)]">
      <main className="flex min-h-[calc(100vh-120px)] items-center justify-center p-6">
        <div className="w-full max-w-[480px]">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 grid h-12 w-12 place-content-center rounded-[var(--radius-sm)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] shadow-[var(--shadow-button-sm)]">
              <span className="text-[var(--color-text-inverse)]">A</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Secure access to your wealth architecture
            </p>
          </div>

          <div className="rounded-[var(--radius-sm)] bg-[var(--color-bg-surface)] p-8 shadow-[var(--shadow-card)]">
            <div className="rounded-[var(--radius-xs)] bg-[var(--color-bg-subtle)] p-1">
              <div className="grid grid-cols-2 gap-1">
                <button className="rounded-[6px] bg-[var(--color-bg-surface)] py-2 text-sm font-semibold text-[var(--color-primary)] shadow-[var(--shadow-soft)]">
                  Login
                </button>
                <Link
                  to="/register"
                  className="rounded-[6px] py-2 text-center text-sm font-semibold text-[var(--color-text-muted)]"
                >
                  Register
                </Link>
              </div>
            </div>

            {successMessage && (
              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-emerald-700">
                <AlertCircle size={12} />
                <span>{successMessage}</span>
              </div>
            )}

            {displayError && (
              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[var(--color-state-error)]">
                <AlertCircle size={12} />
                <span>{displayError}</span>
              </div>
            )}

            <form
              className={`${displayError || successMessage ? "mt-4" : "mt-8"} space-y-6`}
              onSubmit={handleSubmit}
            >
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-[var(--color-text-secondary)]">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  className="mt-1.5 w-full rounded-[var(--radius-xs)] border border-transparent border-b-2 bg-[var(--color-bg-subtle)] px-4 py-3.5 text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-input-placeholder)] outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-[var(--color-text-secondary)]">
                    Password
                  </label>
                  <a href="#!" className="text-[11px] font-semibold uppercase text-[var(--color-primary)]">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loading}
                    className="mt-1.5 w-full rounded-[var(--radius-xs)] border border-transparent border-b-2 bg-[var(--color-bg-subtle)] px-4 py-3.5 pr-10 text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-input-placeholder)] outline-none disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-[var(--color-input-icon)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] py-4 text-base font-bold text-[var(--color-text-inverse)] shadow-[var(--shadow-button-sm)] disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
                {!loading && <ArrowRight size={14} />}
              </button>
            </form>
          </div>

          <p className="mx-auto mt-6 max-w-[360px] text-center text-xs text-[var(--color-text-secondary)]">
            By signing in, you agree to our{" "}
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

export default LoginPage;

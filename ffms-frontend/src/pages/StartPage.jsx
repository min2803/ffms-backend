import { ArrowRight, Building2, ChartNoAxesCombined, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";
import { getCurrentYear } from "../utils/dateTime";

const familyImage =
  "https://www.figma.com/api/mcp/asset/40c0f8de-9c9d-410d-9203-3ad305d78aec";
const avatarOne =
  "https://www.figma.com/api/mcp/asset/bc045820-381c-4a4e-b56c-cd5da50b1f8a";
const avatarTwo =
  "https://www.figma.com/api/mcp/asset/738e908e-6421-45c8-a4a0-311dca26d284";

function StartPage() {
  const currentYear = getCurrentYear();

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-secondary)]">
      <header className="sticky top-0 z-20 border-b border-[var(--color-border-light)] bg-[var(--color-bg-sidebar)]/50 backdrop-blur-[var(--blur-header)]">
        <nav className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-8">
            <span className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">FFMS</span>
            <div className="hidden gap-6 text-sm text-[var(--color-text-muted)] md:flex">
              <a href="#!" className="hover:text-[var(--color-text-primary)]">Support</a>
              <a href="#!" className="hover:text-[var(--color-text-primary)]">Security</a>
              <a href="#!" className="hover:text-[var(--color-text-primary)]">Privacy</a>
            </div>
          </div>
          <Link
            to="/login"
            className="rounded-[var(--radius-sm)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] px-6 py-2.5 text-sm font-semibold text-[var(--color-text-inverse)] shadow-[var(--shadow-button-sm)]"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 right-0 h-[600px] w-[600px] rounded-full bg-[var(--color-primary-2)] opacity-20 blur-[var(--blur-glow-xl)]" />
        <div className="pointer-events-none absolute right-20 top-64 h-[400px] w-[400px] rounded-full bg-[var(--color-secondary)] opacity-20 blur-[var(--blur-glow-lg)]" />

        <section className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-[1280px] items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:px-6">
          <div className="max-w-xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-badge)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1px] text-[var(--color-text-secondary)]">
              Built for Modern Families
            </div>
            <h1 className="text-5xl leading-[1.05] font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-7xl">
              Architectural Precision in{" "}
              <span className="text-[var(--color-primary)]">Family Finance.</span>
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-8 text-[var(--color-text-secondary)]">
              Nexus Ledger provides the blueprint for shared prosperity. Track household spending,
              manage collaborative goals, and secure your family&apos;s future with institutional-grade
              tools.
            </p>
            <Link
              to="/login"
              className="mt-10 inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] px-8 py-4 text-xl font-bold text-[var(--color-text-inverse)] shadow-[var(--shadow-button-lg)]"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -left-6 -top-6 h-32 w-32 rounded-[var(--radius-lg)] bg-[rgb(108_248_187/0.3)] blur-[var(--blur-glow-sm)]" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-[rgb(0_163_255/0.2)] blur-[var(--blur-glow-md)]" />

            <div className="relative rounded-[var(--radius-xl)] border border-[var(--color-border-light)] bg-[var(--color-bg-surface)] p-6 shadow-[var(--shadow-card)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-content-center rounded-full bg-[rgb(0_163_255/0.2)] text-[var(--color-primary)]">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-[var(--color-text-secondary)]">Total Family Net Worth</p>
                    <p className="text-3xl font-bold text-[var(--color-text-primary)]">$428,500.42</p>
                  </div>
                </div>
                <div className="flex items-center pr-2">
                  <img className="-mr-2 h-8 w-8 rounded-full border-2 border-white object-cover" src={avatarOne} alt="" />
                  <img className="-mr-2 h-8 w-8 rounded-full border-2 border-white object-cover" src={avatarTwo} alt="" />
                  <span className="grid h-8 w-8 place-content-center rounded-full border-2 border-[var(--color-bg-surface)] bg-[var(--color-bg-badge)] text-[10px] font-bold text-[var(--color-text-primary)]">
                    +2
                  </span>
                </div>
              </div>

              <div className="mb-4 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-content-center rounded-[var(--radius-sm)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-soft)] text-[var(--color-primary)]">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">Monthly Savings Goal</p>
                      <div className="mt-2 h-1.5 w-32 rounded-full bg-[var(--color-bg-progress-track)]">
                        <div className="h-full w-2/3 rounded-full bg-[var(--color-state-success)]" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[var(--color-state-success)]">67%</p>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] p-4">
                  <ChartNoAxesCombined className="mb-4 text-amber-500" size={20} />
                  <p className="text-xs text-[var(--color-text-secondary)]">Investment Growth</p>
                  <p className="text-3xl font-bold text-[var(--color-text-primary)]">+12.4%</p>
                </div>
                <div className="rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] p-4">
                  <ReceiptText className="mb-4 text-red-500" size={20} />
                  <p className="text-xs text-[var(--color-text-secondary)]">Recent Expense</p>
                  <p className="text-3xl font-bold text-[var(--color-text-primary)]">-$2,140</p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[var(--radius-md)]">
                <img className="h-72 w-full object-cover" src={familyImage} alt="Family financial dashboard" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgb(0_98_157/0.6)] to-[rgb(0_98_157/0)]" />
                <p className="absolute bottom-4 left-4 text-xs text-[var(--color-text-inverse)]">Real-time collaboration across all devices.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border-light)] bg-[var(--color-bg-footer)]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col justify-between gap-6 px-4 py-10 text-[var(--color-text-soft)] md:flex-row md:items-center">
          <div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">FFMS</p>
            <p className="mt-2 text-sm">© {currentYear} FFMS. Architectural Precision in Family Finance.</p>
          </div>
          <div className="flex flex-wrap gap-8 text-[11px] font-normal uppercase tracking-[1.1px]">
            <a href="#!">Terms of Service</a>
            <a href="#!">Privacy Policy</a>
            <a href="#!">Cookie Settings</a>
            <a href="#!">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StartPage;

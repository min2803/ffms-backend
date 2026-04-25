import { useState, useEffect } from "react";
import { BriefcaseBusiness, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Sidebar navigation component.
 *
 * @param {Object}   props
 * @param {Array}    props.navItems        – [{ id, label, icon: LucideComponent, active? }]
 * @param {boolean}  props.collapsed       – whether the sidebar is in collapsed mode
 */
export default function Sidebar({ navItems = [], collapsed = false, brandLabel = "Family Office" }) {
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const initialExpanded = {};
    navItems.forEach(item => {
      if (item.active && item.subItems?.length) {
        initialExpanded[item.id] = true;
      }
    });
    setExpanded(prev => ({ ...prev, ...initialExpanded }));
  }, [navItems]);

  const handleToggle = (e, item) => {
    if (item.subItems && item.subItems.length > 0) {
      e.preventDefault();
      setExpanded(prev => ({ ...prev, [item.id]: !prev[item.id] }));
    }
  };

  return (
    <>
      {/* Brand */}
      <div className="mb-6 flex items-center gap-2.5 px-4 pt-5">
        <div className="grid h-9 w-9 shrink-0 place-content-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-[var(--color-text-inverse)]">
          <BriefcaseBusiness size={18} />
        </div>
        {!collapsed && (
          <div>
            <p className="text-lg font-bold leading-none tracking-tight">FFMS</p>
            <p className="text-[10px] font-semibold uppercase tracking-[1.2px] text-[var(--color-text-muted)]">
              {brandLabel}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-3 pb-4 text-[13px] font-medium text-[var(--color-text-muted)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
          const isExpanded = expanded[item.id];

          return (
            <div key={item.id} className="space-y-1">
              <Link
                to={item.href || "#!"}
                onClick={(e) => handleToggle(e, item)}
                className={`flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-left transition ${
                  item.active
                    ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-soft)]"
                    : "hover:bg-[var(--color-bg-surface)]/80 text-[var(--color-text-muted)]"
                }`}
              >
                <Icon size={16} />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {!collapsed && hasSubItems && (
                  isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                )}
              </Link>

              {!collapsed && hasSubItems && isExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.id}
                      to={sub.href}
                      className={`block rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold transition ${
                        sub.active
                          ? "text-[var(--color-primary)] bg-[var(--color-bg-subtle)]"
                          : "text-[var(--color-text-soft)] hover:text-[var(--color-text-primary)] hover:bg-gray-50"
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}

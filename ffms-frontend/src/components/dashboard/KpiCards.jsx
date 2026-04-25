import { ShieldCheck } from "lucide-react";

/**
 * KPI metric cards row.
 *
 * @param {Object}  props
 * @param {Array}   props.cards – array of card objects:
 *   {
 *     title:       string,       – label text (e.g. "Total Income")
 *     value:       string,       – formatted value (e.g. "$42,850.00")
 *     icon:        LucideIcon,   – icon component
 *     iconBg:      string,       – Tailwind classes for icon wrapper (e.g. "bg-blue-50 text-blue-600")
 *     highlighted: boolean,      – if true, renders the blue gradient variant
 *     badge:       string|null,  – optional badge text (e.g. "Secured by Vault-Tech")
 *   }
 */
export default function KpiCards({ cards = [] }) {
  return (
    <section className="grid grid-cols-12 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        if (card.highlighted) {
          return (
            <article
              key={card.title}
              className="col-span-4 rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] p-5 text-[var(--color-text-inverse)] shadow-md"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-200">
                {card.title}
              </p>
              <p className="mt-2 text-3xl font-bold">{card.value}</p>
              {card.badge && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-100">
                  <ShieldCheck size={13} />
                  <span>{card.badge}</span>
                </div>
              )}
            </article>
          );
        }

        return (
          <article
            key={card.title}
            className="col-span-4 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-5 shadow-[var(--shadow-soft)]"
          >
            <div className={`mb-3 inline-grid h-9 w-9 place-content-center rounded-[var(--radius-xs)] ${card.iconBg}`}>
              <Icon size={16} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-soft)]">
              {card.title}
            </p>
            <p className="mt-1 text-3xl font-bold text-[var(--color-text-primary)]">{card.value}</p>
          </article>
        );
      })}
    </section>
  );
}

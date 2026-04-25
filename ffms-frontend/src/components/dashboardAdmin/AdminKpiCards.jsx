import AdminKpiCard from "./AdminKpiCard";

/**
 * Row of KPI stat cards for the admin dashboard.
 *
 * @param {Object}  props
 * @param {Array}   props.cards – array of AdminKpiCard props
 */
export default function AdminKpiCards({ cards }) {
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <AdminKpiCard key={card.id} {...card} />
      ))}
    </section>
  );
}

import { Gauge, Wallet } from "lucide-react";
import { formatDate, getDateDaysAgo } from "../utils/dateTime";

export const utilityTopStats = [
  {
    id: "usage",
    icon: Gauge,
    iconTone: "bg-[var(--color-bg-utility-icon-primary)] text-[var(--color-primary)]",
    title: "Monthly Usage",
    value: "412.5",
    unit: "kWh",
    footerLabel: "Daily Average",
    footerValue: "13.7 kWh",
  },
  {
    id: "cost",
    icon: Wallet,
    iconTone: "bg-[var(--color-bg-utility-icon-accent)] text-[var(--color-role-member-text)]",
    title: "Estimated Cost",
    value: "$128.40",
    unit: "",
    footerLabel: "Projected Bill",
    footerValue: "$152.00",
  },
];

export const utilityChartLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
export const utilityChartUpperBars = [42, 30, 54, 48, 37, 60, 42];
export const utilityChartLowerBars = [22, 24, 18, 36, 19, 37, 22];

const meterIncrements = [12, 15, 11, 14];

export function buildUtilityMeterHistory() {
  const baseReading = 14281;

  return meterIncrements.map((delta, index) => {
    const reading = baseReading - index * 12;

    return {
      id: `meter-${index}`,
      dateLabel: formatDate(getDateDaysAgo(index)),
      type: index % 2 === 0 ? "AUTOMATIC SYNC" : "MANUAL ENTRY",
      reading: `${reading.toLocaleString()} kWh`,
      delta: `${delta} kWh`,
    };
  });
}

export const utilityRecommendation = {
  title: "AI RECOMMENDATION",
  message:
    "You're using 22% more energy on Tuesdays. Consider shifting washer loads to weekends.",
  actionLabel: "View Energy Audit ->",
};

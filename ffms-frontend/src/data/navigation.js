import {
  ChartNoAxesCombined,
  Cog,
  HandCoins,
  House,
  NotebookText,
  Wrench,
  WalletCards,
} from "lucide-react";

const BASE_NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: ChartNoAxesCombined },
  { id: "household", label: "Household", href: "/household", icon: House },
  { id: "income", label: "Income", href: "/income", icon: HandCoins },
  {
    id: "expense",
    label: "Expense",
    href: "#!",
    icon: NotebookText,
    subItems: [
      { id: "expense-personal", label: "Personal", href: "/expense/personal" },
      { id: "expense-family", label: "Family", href: "/expense/family" },
    ],
  },
  { id: "budget", label: "Budget", href: "/budget", icon: WalletCards },
  { id: "utilities", label: "Utilities", href: "/utilities", icon: Wrench },
  { id: "settings", label: "Settings", href: "/settings", icon: Cog },
];

export function getNavigationItems(activeId, activeSubId) {
  return BASE_NAV_ITEMS.map((item) => ({
    ...item,
    active: item.id === activeId,
    subItems: item.subItems?.map((sub) => ({
      ...sub,
      active: sub.id === activeSubId,
    })),
  }));
}

export const householdNavItems = getNavigationItems("household");

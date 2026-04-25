export const budgetSummary = {
  totalBudget: 12450.00,
  totalUsedPercent: 68,
  remainingBalance: 3984.20,
  projectedSavings: 1200,
  violations: {
    count: 2,
    message: "Housing and Dining out have exceeded their set limits."
  }
};

export const budgetCategories = [
  {
    id: "b1",
    name: "Utilities",
    type: "FIXED EXPENSE",
    limit: 450.00,
    spent: 312.40,
    percent: 69,
    status: "good",
    icon: "Zap",
  },
  {
    id: "b2",
    name: "Dining Out",
    type: "OVER BUDGET",
    limit: 800.00,
    spent: 924.50,
    percent: 115,
    status: "over",
    icon: "Utensils",
  },
  {
    id: "b3",
    name: "Shopping",
    type: "LIFESTYLE",
    limit: 1200.00,
    spent: 1140.00,
    percent: 95,
    status: "warning",
    icon: "ShoppingBag",
  }
];

export const weeklyProjections = [
  { week: "WEEK 1", amount: 40, height: "40%" },
  { week: "WEEK 2", amount: 60, height: "60%" },
  { week: "WEEK 3", amount: 80, height: "80%" },
  { week: "PROJECTION", amount: 100, isProjection: true, height: "100%" },
];

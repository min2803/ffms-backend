import { formatDate, formatDateWithTime, getDateDaysAgo } from "../utils/dateTime";

const personalExpenseDates = [
  formatDateWithTime(getDateDaysAgo(0)),
  formatDateWithTime(getDateDaysAgo(1)),
  formatDateWithTime(getDateDaysAgo(2)),
  formatDateWithTime(getDateDaysAgo(3)),
  formatDateWithTime(getDateDaysAgo(4)),
];

const familyExpenseDates = [
  formatDate(getDateDaysAgo(0)),
  formatDate(getDateDaysAgo(2)),
  formatDate(getDateDaysAgo(4)),
  formatDate(getDateDaysAgo(6)),
];

export const personalExpenseData = {
  summary: {
    total: 4852.20,
    fixed: 2100.00,
    variable: 2340.50,
    unplanned: 411.70,
  },
  allocations: [
    { category: "Rent & Utilities", amount: 1850, percent: 38 },
    { category: "Food & Dining", amount: 940, percent: 19 },
    { category: "Transport", amount: 420, percent: 9 },
    { category: "Lifestyle", amount: 1642, percent: 34 },
  ],
  transactions: [
    { id: "p1", title: "Whole Foods Market", date: personalExpenseDates[0], category: "FOOD & DINING", amount: -142.50, status: "Completed", icon: "ShoppingCart" },
    { id: "p2", title: "Uber Technologies", date: personalExpenseDates[1], category: "TRANSPORT", amount: -38.20, status: "Completed", icon: "Car" },
    { id: "p3", title: "Skyline Properties LLC", date: personalExpenseDates[2], category: "RENT", amount: -1850.00, status: "Completed", icon: "Home" },
    { id: "p4", title: "Zara Home", date: personalExpenseDates[3], category: "LIFESTYLE", amount: -215.00, status: "Pending", icon: "LampDesk" },
    { id: "p5", title: "The Alchemist Bar", date: personalExpenseDates[4], category: "FOOD & DINING", amount: -92.00, status: "Completed", icon: "Utensils" },
  ]
};

export const familyExpenseData = {
  summary: {
    total: 8432.50,
    sharedBudget: 12000.00,
    dailyAverage: 272.01,
  },
  members: [
    { name: "James", role: "Primary", amount: 3794.62, percent: 45, avatar: "https://i.pravatar.cc/150?u=james" },
    { name: "Sarah", role: "", amount: 3204.35, percent: 38, avatar: "https://i.pravatar.cc/150?u=sarah" },
    { name: "Shared Fund", role: "", amount: 1433.53, percent: 17, avatar: null },
  ],
  categories: [
    { name: "Housing", percent: 34, color: "bg-blue-500" },
    { name: "Groceries", percent: 22, color: "bg-green-500" },
    { name: "Transport", percent: 15, color: "bg-yellow-500" },
    { name: "Entertainment", percent: 12, color: "bg-purple-500" },
  ],
  transactions: [
    { id: "f1", title: "Whole Foods Market", subtitle: `Groceries • ${familyExpenseDates[0]}`, amount: -242.15, status: "SETTLED", icon: "ShoppingCart", avatars: ["https://i.pravatar.cc/150?u=james", "https://i.pravatar.cc/150?u=sarah"] },
    { id: "f2", title: "City Power & Light", subtitle: `Utilities • ${familyExpenseDates[1]}`, amount: -185.00, status: "PENDING REVIEW", icon: "Lightbulb", avatars: ["https://i.pravatar.cc/150?u=james"] },
    { id: "f3", title: "Netflix Subscription", subtitle: `Entertainment • ${familyExpenseDates[2]}`, amount: -15.99, status: "SETTLED", icon: "Clapperboard", avatars: ["https://i.pravatar.cc/150?u=sarah"] },
    { id: "f4", title: "The Oak & Ivy Dinner", subtitle: `Dining Out • ${familyExpenseDates[3]}`, amount: -112.40, status: "SETTLED", icon: "Utensils", avatars: ["https://i.pravatar.cc/150?u=james", "https://i.pravatar.cc/150?u=sarah"] },
  ]
};

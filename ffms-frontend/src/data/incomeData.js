import { formatDate, getDateDaysAgo } from "../utils/dateTime";

export const incomeTransactions = [
  {
    id: "tx1",
    sourceTitle: "Stripe Payout",
    sourceSubtitle: "Online Sales",
    date: formatDate(getDateDaysAgo(0)),
    status: "COMPLETED",
    amount: "$2,450.00",
    icon: "Banknote",
  },
  {
    id: "tx2",
    sourceTitle: "Tech Corp Dividends",
    sourceSubtitle: "Global Equity Fund",
    date: formatDate(getDateDaysAgo(1)),
    status: "COMPLETED",
    amount: "$12,450.00",
    icon: "Building2",
  },
  {
    id: "tx3",
    sourceTitle: "Harbor View Rentals",
    sourceSubtitle: "Unit 402 - Monthly",
    date: formatDate(getDateDaysAgo(3)),
    status: "COMPLETED",
    amount: "$3,200.00",
    icon: "Building",
  },
  {
    id: "tx4",
    sourceTitle: "Consulting Fee",
    sourceSubtitle: "Starlight Advisory",
    date: formatDate(getDateDaysAgo(6)),
    status: "PENDING",
    amount: "$8,000.00",
    icon: "Banknote",
  },
];

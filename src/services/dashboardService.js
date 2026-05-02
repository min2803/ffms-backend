const DashboardReportModel = require("../models/dashboardReportModel");
const { getMonthDateRange, isValidDate } = require("../utils/validation");
const { verifyMembership } = require("../utils/membership");

const DashboardService = {
    async getSummary(userId, householdId, { month, year }) {
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }

        await verifyMembership(householdId, userId);

        const now = new Date();
        const m = month || (now.getMonth() + 1);
        const y = year || now.getFullYear();

        const range = getMonthDateRange(m, y);
        if (!range) {
            throw { status: 400, message: "Invalid month or year" };
        }

        const totalIncome = await DashboardReportModel.getTotalIncome(householdId, range.fromDate, range.toDate);
        const totalExpense = await DashboardReportModel.getTotalExpense(householdId, range.fromDate, range.toDate);

        const sixMonthsAgo = new Date(y, m - 6, 1);
        const trendFromDate = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, "0")}-01`;
        const incomeTrend = await DashboardReportModel.getTrendByMonth(householdId, trendFromDate, range.toDate, "income");
        const expenseTrend = await DashboardReportModel.getTrendByMonth(householdId, trendFromDate, range.toDate, "expense");

        const months = incomeTrend.map(t => t.date);
        const flowData = {
            income: incomeTrend.map(t => parseFloat(t.value)),
            expense: months.map(monthStr => {
                const found = expenseTrend.find(et => et.date === monthStr);
                return found ? parseFloat(found.value) : 0;
            })
        };

        const incomes = await DashboardReportModel.getIncomeDetailList(householdId, range.fromDate, range.toDate);
        const expenses = await DashboardReportModel.getExpenseDetailList(householdId, range.fromDate, range.toDate);

        const activities = [
            ...incomes.map(i => ({ name: i.source, category: "Income", time: i.income_date, amount: parseFloat(i.amount) })),
            ...expenses.map(e => ({ name: e.description || e.category_name, category: e.category_name, time: e.expense_date, amount: -parseFloat(e.amount) }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

        const formatVND = (num) => num.toLocaleString("vi-VN") + " VND";

        const kpiCards = [
            {
                title: "Total Income",
                value: formatVND(totalIncome),
                iconName: "TrendingUp",
                iconBg: "bg-emerald-50 text-emerald-600",
                highlighted: true,
                badge: "Month Overview"
            },
            {
                title: "Total Expense",
                value: formatVND(totalExpense),
                iconName: "TrendingDown",
                iconBg: "bg-rose-50 text-rose-600",
                highlighted: false
            },
            {
                title: "Net Balance",
                value: formatVND(totalIncome - totalExpense),
                iconName: "Zap",
                iconBg: "bg-blue-50 text-blue-600",
                highlighted: false
            }
        ];

        const balance = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

        const aiInsights = [
            {
                id: 1,
                title: "Spending Pattern",
                description: totalExpense > totalIncome
                    ? "Your expenses exceed income this month. Consider reviewing non-essential spending."
                    : `You are saving ${savingsRate}% of your income. Keep up the good financial discipline!`,
                type: totalExpense > totalIncome ? "warning" : "positive"
            },
            {
                id: 2,
                title: "Budget Tip",
                description: "Track daily expenses consistently to identify areas where you can cut costs.",
                type: "info"
            }
        ];

        const assetAllocation = totalIncome > 0 ? [
            { name: "Expenses", value: Math.min(totalExpense, totalIncome), percentage: Math.min(((totalExpense / totalIncome) * 100), 100).toFixed(1) },
            { name: "Savings", value: Math.max(balance, 0), percentage: Math.max(savingsRate, 0) }
        ] : [];

        return {
            totalIncome,
            totalExpense,
            balance,
            kpiCards,
            flowData,
            months,
            activities,
            aiInsights,
            assetAllocation
        };
    },

    async getCompare(userId, householdId, { fromDate, toDate }) {
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }

        if (!isValidDate(fromDate) || !isValidDate(toDate)) {
            throw { status: 400, message: "fromDate and toDate are required in YYYY-MM-DD format" };
        }

        if (fromDate > toDate) {
            throw { status: 400, message: "fromDate must be before or equal to toDate" };
        }

        await verifyMembership(householdId, userId);

        const income = await DashboardReportModel.getTotalIncome(householdId, fromDate, toDate);
        const expense = await DashboardReportModel.getTotalExpense(householdId, fromDate, toDate);

        return { income, expense };
    }
};

module.exports = DashboardService;

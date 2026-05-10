const DashboardReportModel = require("../models/dashboardReportModel");
const BudgetModel = require("../models/budgetModel");
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

        // Lấy chi tiêu theo danh mục và ngân sách từng danh mục
        const categoryExpenses = await DashboardReportModel.getExpenseByCategory(householdId, range.fromDate, range.toDate);
        const categoryBudgets = await BudgetModel.findByHouseholdAndMonth(householdId, m, y);

        // Build budget map: category_name => amount
        const budgetMap = {};
        for (const b of categoryBudgets) {
            if (b.category_name) budgetMap[b.category_name] = parseFloat(b.amount);
        }

        // Tìm các danh mục vượt ngân sách
        const overspentCategories = [];
        for (const cat of categoryExpenses) {
            const spent = parseFloat(cat.total);
            const budget = budgetMap[cat.category];
            if (budget !== undefined && spent > budget) {
                overspentCategories.push({
                    name: cat.category,
                    spent,
                    budget,
                    overAmount: spent - budget,
                    usagePercent: Math.round((spent / budget) * 100)
                });
            }
        }
        // Sắp xếp theo mức vượt giảm dần
        overspentCategories.sort((a, b) => b.overAmount - a.overAmount);

        const formatVNDShort = (num) => {
            if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + " triệu VND";
            if (num >= 1_000) return Math.round(num / 1_000) + " nghìn VND";
            return num.toLocaleString("vi-VN") + " VND";
        };

        const aiInsights = [];
        let insightId = 1;

        // Insight 1: Tổng quan chi tiêu
        aiInsights.push({
            id: insightId++,
            title: "Spending Pattern",
            description: totalExpense > totalIncome
                ? "Your expenses exceed income this month. Consider reviewing non-essential spending."
                : `You are saving ${savingsRate}% of your income. Keep up the good financial discipline!`,
            type: totalExpense > totalIncome ? "warning" : "positive"
        });

        // Insight 2+: Cụ thể từng danh mục vượt ngân sách (tối đa 3)
        const topOverspent = overspentCategories.slice(0, 3);
        for (const cat of topOverspent) {
            aiInsights.push({
                id: insightId++,
                title: `Over Budget: ${cat.name}`,
                description: `"${cat.name}" spent ${formatVNDShort(cat.spent)} but budget is only ${formatVNDShort(cat.budget)} (${cat.usagePercent}% used, over by ${formatVNDShort(cat.overAmount)}). Consider reducing ${cat.name.toLowerCase()} spending next month.`,
                type: "warning",
                progress: Math.min(cat.usagePercent, 100)
            });
        }

        // Nếu không có danh mục nào vượt ngân sách, thêm tip chung
        if (topOverspent.length === 0) {
            aiInsights.push({
                id: insightId++,
                title: "Budget Tip",
                description: "All spending categories are within budget. Track daily expenses consistently to maintain this discipline.",
                type: "info"
            });
        }

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

const DashboardReportModel = require("../models/dashboardReportModel");
const HouseholdModel = require("../models/householdModel");

/**
 * Helper: convert month/year thành khoảng date (fromDate, toDate)
 */
function getMonthDateRange(month, year) {
    const m = parseInt(month);
    const y = parseInt(year);

    if (isNaN(m) || isNaN(y) || m < 1 || m > 12 || y < 1900 || y > 2100) {
        return null;
    }

    const fromDate = `${y}-${String(m).padStart(2, "0")}-01`;
    // Ngày cuối tháng
    const lastDay = new Date(y, m, 0).getDate();
    const toDate = `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    return { fromDate, toDate };
}

/**
 * Helper: validate date format YYYY-MM-DD
 */
function isValidDate(dateStr) {
    if (!dateStr) return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

/**
 * Helper: verify household membership
 */
async function verifyMembership(householdId, userId) {
    const household = await HouseholdModel.findById(householdId);
    if (!household) {
        throw { status: 404, message: "Household not found" };
    }

    const member = await HouseholdModel.findMember(householdId, userId);
    if (!member) {
        throw { status: 403, message: "You are not a member of this household" };
    }
}

const DashboardService = {
    /**
     * GET /api/dashboard/summary
     * Query: { householdId, month?, year? }
     * → { totalIncome, totalExpense, balance }
     */
    async getSummary(userId, householdId, { month, year }) {
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }

        await verifyMembership(householdId, userId);

        // Default: tháng/năm hiện tại
        const now = new Date();
        const m = month || (now.getMonth() + 1);
        const y = year || now.getFullYear();

        const range = getMonthDateRange(m, y);
        if (!range) {
            throw { status: 400, message: "Invalid month or year" };
        }

        const totalIncome = await DashboardReportModel.getTotalIncome(householdId, range.fromDate, range.toDate);
        const totalExpense = await DashboardReportModel.getTotalExpense(householdId, range.fromDate, range.toDate);
        
        // Lấy trend cho 6 tháng gần nhất để vẽ chart
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

        // Lấy activities gần nhất
        const incomes = await DashboardReportModel.getIncomeDetailList(householdId, range.fromDate, range.toDate);
        const expenses = await DashboardReportModel.getExpenseDetailList(householdId, range.fromDate, range.toDate);
        
        const activities = [
            ...incomes.map(i => ({ name: i.source, category: "Income", time: i.income_date, amount: parseFloat(i.amount) })),
            ...expenses.map(e => ({ name: e.description || e.category_name, category: e.category_name, time: e.expense_date, amount: -parseFloat(e.amount) }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

        // Cấu trúc KPI Cards (Frontend sẽ map icon dựa trên title hoặc type)
        const kpiCards = [
            { 
                title: "Total Income", 
                value: `$${totalIncome.toLocaleString()}`, 
                iconName: "TrendingUp", 
                iconBg: "bg-emerald-50 text-emerald-600",
                highlighted: true,
                badge: "Month Overview"
            },
            { 
                title: "Total Expense", 
                value: `$${totalExpense.toLocaleString()}`, 
                iconName: "TrendingDown", 
                iconBg: "bg-rose-50 text-rose-600",
                highlighted: false
            },
            { 
                title: "Net Balance", 
                value: `$${(totalIncome - totalExpense).toLocaleString()}`, 
                iconName: "Zap", 
                iconBg: "bg-blue-50 text-blue-600",
                highlighted: false
            }
        ];

        return {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
            kpiCards,
            flowData,
            months,
            activities,
            aiInsights: [
                { type: "tip", message: "Chi tiêu cho ăn uống tăng 15% so với tháng trước." },
                { type: "success", message: "Bạn đã tiết kiệm được $500 trong tháng này!" }
            ],
            assetAllocation: [
                { name: "Savings", value: 40, color: "bg-blue-500" },
                { name: "Investment", value: 30, color: "bg-emerald-500" },
                { name: "Cash", value: 30, color: "bg-orange-500" }
            ]
        };
    },

    /**
     * GET /api/dashboard/compare
     * Query: { householdId, fromDate, toDate }
     * → { income, expense }
     */
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

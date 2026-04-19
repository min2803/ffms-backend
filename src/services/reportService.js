const DashboardReportModel = require("../models/dashboardReportModel");
const HouseholdModel = require("../models/householdModel");

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
 * Helper: get default date range (current month)
 */
function getDefaultDateRange() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const fromDate = `${y}-${String(m).padStart(2, "0")}-01`;
    const lastDay = new Date(y, m, 0).getDate();
    const toDate = `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    return { fromDate, toDate };
}

/**
 * Helper: validate and resolve date range — dùng default nếu thiếu
 */
function resolveDateRange(fromDate, toDate) {
    if (!fromDate && !toDate) {
        return getDefaultDateRange();
    }

    if (!isValidDate(fromDate) || !isValidDate(toDate)) {
        throw { status: 400, message: "fromDate and toDate are required in YYYY-MM-DD format" };
    }

    if (fromDate > toDate) {
        throw { status: 400, message: "fromDate must be before or equal to toDate" };
    }

    return { fromDate, toDate };
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

const VALID_TYPES = ["income", "expense"];
const VALID_PERIODS = ["day", "month"];

const ReportService = {
    /**
     * GET /api/reports/expense-category
     * Query: { householdId, fromDate, toDate }
     * → [ { category, total } ]
     */
    async getExpenseByCategory(userId, householdId, { fromDate, toDate }) {
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }

        const range = resolveDateRange(fromDate, toDate);
        await verifyMembership(householdId, userId);

        return await DashboardReportModel.getExpenseByCategory(householdId, range.fromDate, range.toDate);
    },

    /**
     * GET /api/reports/financial
     * Query: { householdId, fromDate, toDate }
     * → { income, expense, balance }
     */
    async getFinancial(userId, householdId, { fromDate, toDate }) {
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }

        const range = resolveDateRange(fromDate, toDate);
        await verifyMembership(householdId, userId);

        const income = await DashboardReportModel.getTotalIncome(householdId, range.fromDate, range.toDate);
        const expense = await DashboardReportModel.getTotalExpense(householdId, range.fromDate, range.toDate);

        return {
            income,
            expense,
            balance: income - expense
        };
    },

    /**
     * GET /api/reports/trend
     * Query: { householdId, type (income|expense), period (day|month), fromDate?, toDate? }
     * → [ { date, value } ]
     */
    async getTrend(userId, householdId, { type, period, fromDate, toDate }) {
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }

        if (!type || !VALID_TYPES.includes(type)) {
            throw { status: 400, message: "type must be 'income' or 'expense'" };
        }

        if (!period || !VALID_PERIODS.includes(period)) {
            throw { status: 400, message: "period must be 'day' or 'month'" };
        }

        const range = resolveDateRange(fromDate, toDate);
        await verifyMembership(householdId, userId);

        if (period === "day") {
            return await DashboardReportModel.getTrendByDay(householdId, range.fromDate, range.toDate, type);
        } else {
            return await DashboardReportModel.getTrendByMonth(householdId, range.fromDate, range.toDate, type);
        }
    },

    /**
     * GET /api/reports/detail
     * Query: { householdId, type (income|expense), fromDate, toDate }
     * → data list
     */
    async getDetail(userId, householdId, { type, fromDate, toDate }) {
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }

        if (!type || !VALID_TYPES.includes(type)) {
            throw { status: 400, message: "type must be 'income' or 'expense'" };
        }

        const range = resolveDateRange(fromDate, toDate);
        await verifyMembership(householdId, userId);

        if (type === "income") {
            return await DashboardReportModel.getIncomeDetailList(householdId, range.fromDate, range.toDate);
        } else {
            return await DashboardReportModel.getExpenseDetailList(householdId, range.fromDate, range.toDate);
        }
    }
};

module.exports = ReportService;

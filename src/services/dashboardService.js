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

        return {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
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

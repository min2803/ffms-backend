const DashboardReportModel = require("../models/dashboardReportModel");
const { resolveDateRange } = require("../utils/validation");
const { verifyMembership } = require("../utils/membership");

const VALID_TYPES = ["income", "expense"];
const VALID_PERIODS = ["day", "month"];

const ReportService = {
    async getExpenseByCategory(userId, householdId, { fromDate, toDate }) {
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }

        const range = resolveDateRange(fromDate, toDate);
        await verifyMembership(householdId, userId);

        return await DashboardReportModel.getExpenseByCategory(householdId, range.fromDate, range.toDate);
    },

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

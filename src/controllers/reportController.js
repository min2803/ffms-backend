const ReportService = require("../services/reportService");
const { handleRequest } = require("../utils/controllerHandler");

const ReportController = {
    getExpenseByCategory: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const householdId = req.householdId;
        const { fromDate, toDate } = req.query;

        if (isNaN(householdId)) {
            return res.status(400).json({
                success: false,
                message: "Valid householdId query parameter is required"
            });
        }

        const data = await ReportService.getExpenseByCategory(userId, householdId, { fromDate, toDate });
        return res.status(200).json({ success: true, data });
    }, "Report expense-category"),

    getFinancial: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const householdId = req.householdId;
        const { fromDate, toDate } = req.query;

        if (isNaN(householdId)) {
            return res.status(400).json({
                success: false,
                message: "Valid householdId query parameter is required"
            });
        }

        const data = await ReportService.getFinancial(userId, householdId, { fromDate, toDate });
        return res.status(200).json({ success: true, data });
    }, "Report financial"),

    getTrend: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const householdId = req.householdId;
        const { type, period, fromDate, toDate } = req.query;

        if (isNaN(householdId)) {
            return res.status(400).json({
                success: false,
                message: "Valid householdId query parameter is required"
            });
        }

        const data = await ReportService.getTrend(userId, householdId, { type, period, fromDate, toDate });
        return res.status(200).json({ success: true, data });
    }, "Report trend"),

    getDetail: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const householdId = req.householdId;
        const { type, fromDate, toDate } = req.query;

        if (isNaN(householdId)) {
            return res.status(400).json({
                success: false,
                message: "Valid householdId query parameter is required"
            });
        }

        const data = await ReportService.getDetail(userId, householdId, { type, fromDate, toDate });
        return res.status(200).json({ success: true, data });
    }, "Report detail")
};

module.exports = ReportController;

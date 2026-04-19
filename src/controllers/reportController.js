const ReportService = require("../services/reportService");

const ReportController = {
    /**
     * GET /api/reports/expense-category
     * Query: { householdId, fromDate?, toDate? }
     */
    async getExpenseByCategory(req, res) {
        try {
            const userId = req.user.userId;
            const householdId = parseInt(req.query.householdId);
            const { fromDate, toDate } = req.query;

            if (isNaN(householdId)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid householdId query parameter is required"
                });
            }

            const data = await ReportService.getExpenseByCategory(userId, householdId, {
                fromDate,
                toDate
            });

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Report expense-category error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * GET /api/reports/financial
     * Query: { householdId, fromDate?, toDate? }
     */
    async getFinancial(req, res) {
        try {
            const userId = req.user.userId;
            const householdId = parseInt(req.query.householdId);
            const { fromDate, toDate } = req.query;

            if (isNaN(householdId)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid householdId query parameter is required"
                });
            }

            const data = await ReportService.getFinancial(userId, householdId, {
                fromDate,
                toDate
            });

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Report financial error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * GET /api/reports/trend
     * Query: { householdId, type (income|expense), period (day|month), fromDate?, toDate? }
     */
    async getTrend(req, res) {
        try {
            const userId = req.user.userId;
            const householdId = parseInt(req.query.householdId);
            const { type, period, fromDate, toDate } = req.query;

            if (isNaN(householdId)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid householdId query parameter is required"
                });
            }

            const data = await ReportService.getTrend(userId, householdId, {
                type,
                period,
                fromDate,
                toDate
            });

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Report trend error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * GET /api/reports/detail
     * Query: { householdId, type (income|expense), fromDate?, toDate? }
     */
    async getDetail(req, res) {
        try {
            const userId = req.user.userId;
            const householdId = parseInt(req.query.householdId);
            const { type, fromDate, toDate } = req.query;

            if (isNaN(householdId)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid householdId query parameter is required"
                });
            }

            const data = await ReportService.getDetail(userId, householdId, {
                type,
                fromDate,
                toDate
            });

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Report detail error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = ReportController;

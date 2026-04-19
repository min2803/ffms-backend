const DashboardService = require("../services/dashboardService");

const DashboardController = {
    /**
     * GET /api/dashboard/summary
     * Query: { householdId, month?, year? }
     */
    async getSummary(req, res) {
        try {
            const userId = req.user.userId;
            const householdId = parseInt(req.query.householdId);
            const { month, year } = req.query;

            if (isNaN(householdId)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid householdId query parameter is required"
                });
            }

            const data = await DashboardService.getSummary(userId, householdId, {
                month: month ? parseInt(month) : undefined,
                year: year ? parseInt(year) : undefined
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
            console.error("Dashboard summary error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * GET /api/dashboard/compare
     * Query: { householdId, fromDate, toDate }
     */
    async getCompare(req, res) {
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

            const data = await DashboardService.getCompare(userId, householdId, {
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
            console.error("Dashboard compare error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = DashboardController;

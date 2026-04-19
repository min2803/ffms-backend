const UtilityService = require("../services/utilityService");

const UtilityController = {
    /**
     * Thêm meter reading
     * POST /api/utilities
     */
    async addReading(req, res) {
        try {
            const userId = req.user.userId;
            const { type, value, cost, date } = req.body;

            const reading = await UtilityService.addReading(userId, { type, value, cost, date });

            return res.status(201).json({
                success: true,
                message: "Utility reading added successfully",
                data: reading
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Add utility reading error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Lấy danh sách consumption data
     * GET /api/utilities?type=electric&month=2026-04
     */
    async getConsumptionData(req, res) {
        try {
            const { type, month } = req.query;

            const data = await UtilityService.getConsumptionData({ type, month });

            return res.status(200).json({
                success: true,
                message: "Consumption data retrieved successfully",
                data
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Get consumption data error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Lấy usage summary theo tháng
     * GET /api/utilities/summary?month=2026-04
     */
    async getUsageSummary(req, res) {
        try {
            const { month } = req.query;

            const summary = await UtilityService.getUsageSummary(month);

            return res.status(200).json({
                success: true,
                message: "Usage summary retrieved successfully",
                data: summary
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Get usage summary error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = UtilityController;

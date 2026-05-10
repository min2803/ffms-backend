const AiService = require("../services/aiService");
const { handleRequest } = require("../utils/controllerHandler");

const AiController = {
    /**
     * GET /api/ai/predict
     * Lấy dự đoán chi tiêu từ AI cho household hiện tại
     */
    getPrediction: handleRequest(async (req, res) => {
        const householdId = req.householdId;

        // Kiểm tra AI service có đang chạy
        const isAlive = await AiService.healthCheck();
        if (!isAlive) {
            return res.status(503).json({
                success: false,
                message: "AI service is not available"
            });
        }

        const prediction = await AiService.getPrediction(householdId);

        if (!prediction) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "Not enough data for prediction (need at least 3 months)"
            });
        }

        return res.status(200).json({
            success: true,
            data: prediction
        });
    }, "AI Prediction"),

    /**
     * GET /api/ai/health
     * Kiểm tra AI service status
     */
    healthCheck: handleRequest(async (req, res) => {
        const isAlive = await AiService.healthCheck();
        return res.status(200).json({
            success: true,
            data: { available: isAlive }
        });
    }, "AI Health Check")
};

module.exports = AiController;

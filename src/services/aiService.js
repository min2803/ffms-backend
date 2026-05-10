/**
 * AI Service — Gọi API AI Microservice (Python FastAPI)
 * Endpoint: GET /predict/{household_id}
 */
const axios = require("axios");

const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const AiService = {
    /**
     * Lấy dự đoán chi tiêu từ AI service
     * @returns { predicted, last_month, budget, increase_percent, status, message, suggestion }
     */
    async getPrediction(householdId) {
        try {
            const response = await axios.get(`${AI_BASE_URL}/predict/${householdId}`, {
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            // AI service có thể chưa chạy hoặc chưa đủ dữ liệu
            if (error.response) {
                const { status, data } = error.response;
                if (status === 404 || status === 400) {
                    // Không có dữ liệu hoặc chưa đủ dữ liệu — trả null
                    return null;
                }
                console.error(`[AiService] API error ${status}:`, data?.detail || data);
            } else {
                console.error("[AiService] Connection error:", error.message);
            }
            return null;
        }
    },

    /**
     * Kiểm tra AI service có đang chạy không
     */
    async healthCheck() {
        try {
            const response = await axios.get(`${AI_BASE_URL}/`, { timeout: 3000 });
            return response.data?.status === "ok";
        } catch {
            return false;
        }
    }
};

module.exports = AiService;

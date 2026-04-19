const UtilityModel = require("../models/utilityModel");

const UtilityService = {
    /**
     * Thêm meter reading mới
     */
    async addReading(userId, { type, value, cost, date }) {
        // Validate type
        if (!type || type.trim().length === 0) {
            throw { status: 400, message: "type is required" };
        }

        // Validate value
        if (value === undefined || value === null || isNaN(value) || Number(value) < 0) {
            throw { status: 400, message: "value must be a non-negative number" };
        }

        // Validate cost
        if (cost === undefined || cost === null || isNaN(cost) || Number(cost) < 0) {
            throw { status: 400, message: "cost must be a non-negative number" };
        }

        // Validate date
        if (!date) {
            throw { status: 400, message: "date is required" };
        }

        const reading = await UtilityModel.create({
            userId,
            type: type.trim().toLowerCase(),
            value: Number(value),
            cost: Number(cost),
            date
        });

        return reading;
    },

    /**
     * Lấy danh sách consumption data với optional filters
     */
    async getConsumptionData({ type, month }) {
        // Validate month format nếu có
        if (month && !/^\d{4}-\d{2}$/.test(month)) {
            throw { status: 400, message: "month must be in format YYYY-MM" };
        }

        const data = await UtilityModel.findAll({
            type: type ? type.trim().toLowerCase() : null,
            month: month || null
        });

        return data;
    },

    /**
     * Lấy usage summary theo tháng
     */
    async getUsageSummary(month) {
        // Validate month
        if (!month) {
            throw { status: 400, message: "month query parameter is required" };
        }

        if (!/^\d{4}-\d{2}$/.test(month)) {
            throw { status: 400, message: "month must be in format YYYY-MM" };
        }

        const rows = await UtilityModel.getSummary(month);

        // Tính tổng chung
        let totalUsage = 0;
        let totalCost = 0;

        rows.forEach((row) => {
            totalUsage += Number(row.totalUsage);
            totalCost += Number(row.totalCost);
        });

        return {
            month,
            breakdown: rows,
            totalUsage,
            totalCost
        };
    }
};

module.exports = UtilityService;

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
     * Lấy consumption data đã transform cho frontend UtilitiesPage
     */
    async getConsumptionData(userId, { type, month }) {
        if (month && !/^\d{4}-\d{2}$/.test(month)) {
            throw { status: 400, message: "month must be in format YYYY-MM" };
        }

        const readings = await UtilityModel.findAll({
            userId,
            type: type ? type.trim().toLowerCase() : null,
            month: month || null
        });

        const totalUsage = readings.reduce((s, r) => s + Number(r.value), 0);
        const totalCost = readings.reduce((s, r) => s + Number(r.cost), 0);
        const avgCost = readings.length > 0 ? totalCost / readings.length : 0;

        const topStats = [
            { id: "usage", rawValue: totalUsage, trend: readings.length > 1 ? "+3%" : "N/A" },
            { id: "cost", rawValue: totalCost, trend: readings.length > 1 ? "+5%" : "N/A" },
            { id: "avg", rawValue: avgCost, trend: "Stable" },
        ];

        const recommendation = readings.length > 0 ? true : null;

        const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyMap = {};
        readings.forEach(r => {
            const d = new Date(r.date);
            const monthIdx = d.getMonth(); // 0-11
            const key = MONTH_NAMES[monthIdx];
            if (!monthlyMap[key]) monthlyMap[key] = { usage: 0, cost: 0, monthIdx };
            monthlyMap[key].usage += Number(r.value);
            monthlyMap[key].cost += Number(r.cost);
        });

        // Sort by month index (Jan=0 → Dec=11) so chart reads left-to-right chronologically
        const sortedEntries = Object.values(monthlyMap).sort((a, b) => a.monthIdx - b.monthIdx);
        const chartMonthIndexes = sortedEntries.map(e => e.monthIdx);
        const chartUpperBars = sortedEntries.map(e => e.usage);
        const chartLowerBars = sortedEntries.map(e => e.cost / 1000);

        const meterHistory = readings.slice(0, 10).map(r => ({
            id: r.id,
            type: r.type,
            value: Number(r.value),
            cost: Number(r.cost),
            date: r.date, // raw date, frontend formats
        }));

        return { topStats, recommendation, chartMonthIndexes, chartUpperBars, chartLowerBars, meterHistory };
    },

    /**
     * Lấy usage summary theo tháng
     */
    async getUsageSummary(userId, month) {
        // Validate month
        if (!month) {
            throw { status: 400, message: "month query parameter is required" };
        }

        if (!/^\d{4}-\d{2}$/.test(month)) {
            throw { status: 400, message: "month must be in format YYYY-MM" };
        }

        const rows = await UtilityModel.getSummary(userId, month);

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

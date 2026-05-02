const UtilityService = require("../services/utilityService");
const { handleRequest } = require("../utils/controllerHandler");

const UtilityController = {
    addReading: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const { type, value, cost, date } = req.body;

        const reading = await UtilityService.addReading(userId, { type, value, cost, date });

        return res.status(201).json({
            success: true,
            message: "Utility reading added successfully",
            data: reading
        });
    }, "Add utility reading"),

    getConsumptionData: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const { type, month } = req.query;

        const data = await UtilityService.getConsumptionData(userId, { type, month });

        return res.status(200).json({
            success: true,
            message: "Consumption data retrieved successfully",
            data
        });
    }, "Get consumption data"),

    getUsageSummary: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const { month } = req.query;

        const summary = await UtilityService.getUsageSummary(userId, month);

        return res.status(200).json({
            success: true,
            message: "Usage summary retrieved successfully",
            data: summary
        });
    }, "Get usage summary")
};

module.exports = UtilityController;

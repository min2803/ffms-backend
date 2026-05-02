const IncomeService = require("../services/incomeService");
const { handleRequest } = require("../utils/controllerHandler");

const IncomeController = {
    createIncome: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const householdId = req.householdId;
        const { categoryId, amount, source, description, incomeDate } = req.body;

        const income = await IncomeService.createIncome(userId, {
            householdId, categoryId, amount, source, description, incomeDate
        });

        return res.status(201).json({
            success: true,
            message: "Income created successfully",
            data: income
        });
    }, "Create income"),

    getIncomes: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const householdId = req.householdId;

        if (isNaN(householdId)) {
            return res.status(400).json({
                success: false,
                message: "Valid householdId query parameter is required"
            });
        }

        const incomes = await IncomeService.getIncomesByHousehold(userId, householdId);

        return res.status(200).json({
            success: true,
            message: "Incomes retrieved successfully",
            data: incomes
        });
    }, "Get incomes"),

    getIncomeById: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const incomeId = parseInt(req.params.id);

        if (isNaN(incomeId)) {
            return res.status(400).json({ success: false, message: "Invalid income ID" });
        }

        const income = await IncomeService.getIncomeById(userId, incomeId);

        return res.status(200).json({
            success: true,
            message: "Income retrieved successfully",
            data: income
        });
    }, "Get income by id"),

    deleteIncome: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const incomeId = parseInt(req.params.id);

        if (isNaN(incomeId)) {
            return res.status(400).json({ success: false, message: "Invalid income ID" });
        }

        await IncomeService.deleteIncome(userId, incomeId);

        return res.status(200).json({
            success: true,
            message: "Income deleted successfully"
        });
    }, "Delete income"),

    updateIncome: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const incomeId = parseInt(req.params.id);

        if (isNaN(incomeId)) {
            return res.status(400).json({ success: false, message: "Invalid income ID" });
        }

        const { categoryId, amount, source, description, incomeDate } = req.body;

        const income = await IncomeService.updateIncome(userId, incomeId, {
            categoryId, amount, source, description, incomeDate
        });

        return res.status(200).json({
            success: true,
            message: "Income updated successfully",
            data: income
        });
    }, "Update income")
};

module.exports = IncomeController;

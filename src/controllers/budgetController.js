const BudgetService = require("../services/budgetService");
const { handleRequest } = require("../utils/controllerHandler");

const BudgetController = {
    createBudget: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const { categoryId, month, year, amount } = req.body;
        const householdId = req.body.householdId || req.householdId;

        const budget = await BudgetService.createBudget(userId, {
            householdId, categoryId, month, year, amount
        });

        return res.status(201).json({
            success: true,
            message: "Budget created successfully",
            data: budget
        });
    }, "Create budget"),

    getCurrentBudget: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const householdId = req.householdId;

        if (isNaN(householdId)) {
            return res.status(400).json({
                success: false,
                message: "Valid householdId is required"
            });
        }

        const result = await BudgetService.getCurrentBudget(userId, householdId);

        return res.status(200).json({
            success: true,
            message: result.hasNoBudget
                ? "No budget set for current month"
                : "Current budget retrieved successfully",
            data: result
        });
    }, "Get current budget"),

    getBudgetHistory: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const householdId = req.householdId;
        const limit = parseInt(req.query.limit) || 12;
        const offset = parseInt(req.query.offset) || 0;

        if (isNaN(householdId)) {
            return res.status(400).json({
                success: false,
                message: "Valid householdId is required"
            });
        }

        const history = await BudgetService.getBudgetHistory(userId, householdId, limit, offset);

        return res.status(200).json({
            success: true,
            message: "Budget history retrieved successfully",
            data: history
        });
    }, "Get budget history"),

    getBudgets: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const householdId = req.householdId;
        const month = parseInt(req.query.month);
        const year = parseInt(req.query.year) || new Date().getFullYear();

        if (isNaN(householdId)) {
            return res.status(400).json({
                success: false,
                message: "Valid householdId query parameter is required"
            });
        }

        if (isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({
                success: false,
                message: "Valid month query parameter is required (1-12)"
            });
        }

        const budgets = await BudgetService.getBudgetsByMonth(userId, householdId, month, year);

        return res.status(200).json({
            success: true,
            message: "Budgets retrieved successfully",
            data: budgets
        });
    }, "Get budgets"),

    updateBudget: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const budgetId = parseInt(req.params.id);

        if (isNaN(budgetId)) {
            return res.status(400).json({ success: false, message: "Invalid budget ID" });
        }

        const { amount } = req.body;
        const budget = await BudgetService.updateBudget(userId, budgetId, { amount });

        return res.status(200).json({
            success: true,
            message: "Budget updated successfully",
            data: budget
        });
    }, "Update budget"),

    deleteBudget: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const budgetId = parseInt(req.params.id);

        if (isNaN(budgetId)) {
            return res.status(400).json({ success: false, message: "Invalid budget ID" });
        }

        await BudgetService.deleteBudget(userId, budgetId);

        return res.status(200).json({
            success: true,
            message: "Budget deleted successfully"
        });
    }, "Delete budget")
};

module.exports = BudgetController;

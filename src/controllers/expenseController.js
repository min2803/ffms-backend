const ExpenseService = require("../services/expenseService");
const { handleRequest } = require("../utils/controllerHandler");

const ExpenseController = {
    createExpense: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const { categoryId, amount, description, expenseDate } = req.body;
        const householdId = req.body.householdId || req.householdId;

        const expense = await ExpenseService.createExpense(userId, {
            householdId, categoryId, amount, description, expenseDate
        });

        return res.status(201).json({
            success: true,
            message: "Expense created successfully",
            data: expense
        });
    }, "Create expense"),

    getExpenses: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const householdId = req.householdId;
        const type = req.query.type || "family";

        if (isNaN(householdId)) {
            return res.status(400).json({
                success: false,
                message: "Valid householdId query parameter is required"
            });
        }

        const expenses = await ExpenseService.getExpensesByHousehold(userId, householdId, type);

        return res.status(200).json({
            success: true,
            message: "Expenses retrieved successfully",
            data: expenses
        });
    }, "Get expenses"),

    getExpenseById: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const expenseId = parseInt(req.params.id);

        if (isNaN(expenseId)) {
            return res.status(400).json({ success: false, message: "Invalid expense ID" });
        }

        const expense = await ExpenseService.getExpenseById(userId, expenseId);

        return res.status(200).json({
            success: true,
            message: "Expense retrieved successfully",
            data: expense
        });
    }, "Get expense by id"),

    updateExpense: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const expenseId = parseInt(req.params.id);

        if (isNaN(expenseId)) {
            return res.status(400).json({ success: false, message: "Invalid expense ID" });
        }

        const { categoryId, amount, description, expenseDate } = req.body;

        const expense = await ExpenseService.updateExpense(userId, expenseId, {
            categoryId, amount, description, expenseDate
        });

        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            data: expense
        });
    }, "Update expense"),

    deleteExpense: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const expenseId = parseInt(req.params.id);

        if (isNaN(expenseId)) {
            return res.status(400).json({ success: false, message: "Invalid expense ID" });
        }

        await ExpenseService.deleteExpense(userId, expenseId);

        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });
    }, "Delete expense")
};

module.exports = ExpenseController;

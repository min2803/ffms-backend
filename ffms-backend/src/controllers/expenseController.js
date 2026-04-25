const ExpenseService = require("../services/expenseService");

const ExpenseController = {
    /**
     * Tạo expense mới
     */
    async createExpense(req, res) {
        try {
            const userId = req.user.userId;
            const { categoryId, amount, description, expenseDate } = req.body;
            const householdId = req.body.householdId || req.householdId;

            const expense = await ExpenseService.createExpense(userId, {
                householdId,
                categoryId,
                amount,
                description,
                expenseDate
            });

            return res.status(201).json({
                success: true,
                message: "Expense created successfully",
                data: expense
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Create expense error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Lấy danh sách expenses theo household
     */
    async getExpenses(req, res) {
        try {
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
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Get expenses error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Lấy chi tiết expense theo ID
     */
    async getExpenseById(req, res) {
        try {
            const userId = req.user.userId;
            const expenseId = parseInt(req.params.id);

            if (isNaN(expenseId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid expense ID"
                });
            }

            const expense = await ExpenseService.getExpenseById(userId, expenseId);

            return res.status(200).json({
                success: true,
                message: "Expense retrieved successfully",
                data: expense
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Get expense by id error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Cập nhật expense
     */
    async updateExpense(req, res) {
        try {
            const userId = req.user.userId;
            const expenseId = parseInt(req.params.id);

            if (isNaN(expenseId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid expense ID"
                });
            }

            const { categoryId, amount, description, expenseDate } = req.body;

            const expense = await ExpenseService.updateExpense(userId, expenseId, {
                categoryId,
                amount,
                description,
                expenseDate
            });

            return res.status(200).json({
                success: true,
                message: "Expense updated successfully",
                data: expense
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Update expense error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Xóa expense
     */
    async deleteExpense(req, res) {
        try {
            const userId = req.user.userId;
            const expenseId = parseInt(req.params.id);

            if (isNaN(expenseId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid expense ID"
                });
            }

            await ExpenseService.deleteExpense(userId, expenseId);

            return res.status(200).json({
                success: true,
                message: "Expense deleted successfully"
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Delete expense error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = ExpenseController;

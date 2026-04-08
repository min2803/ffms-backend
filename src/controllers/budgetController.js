const BudgetService = require("../services/budgetService");

const BudgetController = {
    /**
     * Tạo budget mới
     */
    async createBudget(req, res) {
        try {
            const userId = req.user.userId;
            const { householdId, categoryId, month, year, amount } = req.body;

            const budget = await BudgetService.createBudget(userId, {
                householdId,
                categoryId,
                month,
                year,
                amount
            });

            return res.status(201).json({
                success: true,
                message: "Budget created successfully",
                data: budget
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Create budget error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Lấy danh sách budgets theo tháng (kèm usage percentage)
     */
    async getBudgets(req, res) {
        try {
            const userId = req.user.userId;
            const householdId = parseInt(req.query.householdId);
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
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Get budgets error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Cập nhật budget (amount)
     */
    async updateBudget(req, res) {
        try {
            const userId = req.user.userId;
            const budgetId = parseInt(req.params.id);

            if (isNaN(budgetId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid budget ID"
                });
            }

            const { amount } = req.body;

            const budget = await BudgetService.updateBudget(userId, budgetId, { amount });

            return res.status(200).json({
                success: true,
                message: "Budget updated successfully",
                data: budget
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Update budget error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Xóa budget
     */
    async deleteBudget(req, res) {
        try {
            const userId = req.user.userId;
            const budgetId = parseInt(req.params.id);

            if (isNaN(budgetId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid budget ID"
                });
            }

            await BudgetService.deleteBudget(userId, budgetId);

            return res.status(200).json({
                success: true,
                message: "Budget deleted successfully"
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Delete budget error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = BudgetController;

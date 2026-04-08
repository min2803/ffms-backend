const IncomeService = require("../services/incomeService");

const IncomeController = {
    /**
     * Tạo income mới
     */
    async createIncome(req, res) {
        try {
            const userId = req.user.userId;
            const { householdId, amount, source, description, incomeDate } = req.body;

            const income = await IncomeService.createIncome(userId, {
                householdId,
                amount,
                source,
                description,
                incomeDate
            });

            return res.status(201).json({
                success: true,
                message: "Income created successfully",
                data: income
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Create income error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Lấy danh sách incomes theo household
     */
    async getIncomes(req, res) {
        try {
            const userId = req.user.userId;
            const householdId = parseInt(req.query.householdId);

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
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Get incomes error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Lấy chi tiết income theo ID
     */
    async getIncomeById(req, res) {
        try {
            const userId = req.user.userId;
            const incomeId = parseInt(req.params.id);

            if (isNaN(incomeId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid income ID"
                });
            }

            const income = await IncomeService.getIncomeById(userId, incomeId);

            return res.status(200).json({
                success: true,
                message: "Income retrieved successfully",
                data: income
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Get income by id error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Xóa income
     */
    async deleteIncome(req, res) {
        try {
            const userId = req.user.userId;
            const incomeId = parseInt(req.params.id);

            if (isNaN(incomeId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid income ID"
                });
            }

            await IncomeService.deleteIncome(userId, incomeId);

            return res.status(200).json({
                success: true,
                message: "Income deleted successfully"
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Delete income error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Cập nhật income
     */
    async updateIncome(req, res) {
        try {
            const userId = req.user.userId;
            const incomeId = parseInt(req.params.id);

            if (isNaN(incomeId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid income ID"
                });
            }

            const { amount, source, description, incomeDate } = req.body;

            const income = await IncomeService.updateIncome(userId, incomeId, {
                amount,
                source,
                description,
                incomeDate
            });

            return res.status(200).json({
                success: true,
                message: "Income updated successfully",
                data: income
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Update income error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = IncomeController;

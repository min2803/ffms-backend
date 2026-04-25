const BudgetModel = require("../models/budgetModel");
const ExpenseModel = require("../models/expenseModel");
const CategoryModel = require("../models/categoryModel");
const HouseholdModel = require("../models/householdModel");

const BudgetService = {
    /**
     * Tạo budget mới — user phải là thành viên của household
     */
    async createBudget(userId, { householdId, categoryId, month, year, amount }) {
        // Kiểm tra các trường bắt buộc
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }
        if (!categoryId) {
            throw { status: 400, message: "categoryId is required" };
        }
        if (!month || month < 1 || month > 12) {
            throw { status: 400, message: "month must be between 1 and 12" };
        }
        if (!year || year < 2000 || year > 2100) {
            throw { status: 400, message: "year must be a valid year (2000-2100)" };
        }
        if (!amount || amount <= 0) {
            throw { status: 400, message: "amount must be a positive number" };
        }

        // Kiểm tra household tồn tại
        const household = await HouseholdModel.findById(householdId);
        if (!household) {
            throw { status: 404, message: "Household not found" };
        }

        // Kiểm tra user là thành viên của household
        const member = await HouseholdModel.findMember(householdId, userId);
        if (!member) {
            throw { status: 403, message: "You are not a member of this household" };
        }

        // Kiểm tra category tồn tại
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            throw { status: 404, message: "Category not found" };
        }

        // Kiểm tra budget đã tồn tại chưa (tránh trùng lặp)
        const existingBudget = await BudgetModel.findExisting(householdId, categoryId, month, year);
        if (existingBudget) {
            throw { status: 409, message: "Budget already exists for this category in this month" };
        }

        // Tạo budget
        const budget = await BudgetModel.create({
            householdId,
            categoryId,
            month,
            year,
            amount
        });

        return budget;
    },

    /**
     * Lấy danh sách budgets theo household và tháng/năm
     * Kèm theo tính toán usage percentage (%)
     */
    async getBudgetsByMonth(userId, householdId, month, year) {
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }
        if (!month || month < 1 || month > 12) {
            throw { status: 400, message: "month must be between 1 and 12" };
        }
        if (!year || year < 2000 || year > 2100) {
            throw { status: 400, message: "year must be a valid year (2000-2100)" };
        }

        // Kiểm tra household tồn tại
        const household = await HouseholdModel.findById(householdId);
        if (!household) {
            throw { status: 404, message: "Household not found" };
        }

        // Kiểm tra user là thành viên
        const member = await HouseholdModel.findMember(householdId, userId);
        if (!member) {
            throw { status: 403, message: "You are not a member of this household" };
        }

        // Lấy danh sách budgets
        const budgets = await BudgetModel.findByHouseholdAndMonth(householdId, month, year);

        // Tính usage percentage cho từng budget
        const budgetsWithUsage = await Promise.all(
            budgets.map(async (budget) => {
                const totalExpense = await ExpenseModel.getTotalByCategory(
                    householdId,
                    budget.category_id,
                    month,
                    year
                );

                const usagePercentage = budget.amount > 0
                    ? parseFloat(((totalExpense / budget.amount) * 100).toFixed(2))
                    : 0;

                return {
                    ...budget,
                    total_expense: totalExpense,
                    usage_percentage: usagePercentage
                };
            })
        );

        return budgetsWithUsage;
    },

    /**
     * Cập nhật budget — chỉ người tạo hoặc owner/admin của household
     */
    async updateBudget(userId, budgetId, { amount }) {
        // Validate amount
        if (!amount || amount <= 0) {
            throw { status: 400, message: "amount must be a positive number" };
        }

        // Kiểm tra budget tồn tại
        const budget = await BudgetModel.findById(budgetId);
        if (!budget) {
            throw { status: 404, message: "Budget not found" };
        }

        // Kiểm tra user là thành viên của household
        const member = await HouseholdModel.findMember(budget.household_id, userId);
        if (!member) {
            throw { status: 403, message: "You are not a member of this household" };
        }

        // Kiểm tra quyền: chỉ owner/admin mới được cập nhật
        if (!["owner", "admin"].includes(member.role)) {
            throw { status: 403, message: "Only owner or admin can update budget" };
        }

        // Cập nhật
        const updatedBudget = await BudgetModel.updateById(budgetId, { amount });
        return updatedBudget;
    },

    /**
     * Xóa budget — chỉ owner/admin của household
     */
    async deleteBudget(userId, budgetId) {
        // Kiểm tra budget tồn tại
        const budget = await BudgetModel.findById(budgetId);
        if (!budget) {
            throw { status: 404, message: "Budget not found" };
        }

        // Kiểm tra user là thành viên của household
        const member = await HouseholdModel.findMember(budget.household_id, userId);
        if (!member) {
            throw { status: 403, message: "You are not a member of this household" };
        }

        // Kiểm tra quyền: chỉ owner/admin mới được xóa
        if (!["owner", "admin"].includes(member.role)) {
            throw { status: 403, message: "Only owner or admin can delete budget" };
        }

        await BudgetModel.deleteById(budgetId);
    }
};

module.exports = BudgetService;

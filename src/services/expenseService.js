const ExpenseModel = require("../models/expenseModel");
const CategoryModel = require("../models/categoryModel");
const HouseholdModel = require("../models/householdModel");

const ExpenseService = {
    /**
     * Tạo expense mới — user phải là thành viên của household
     */
    async createExpense(userId, { householdId, categoryId, amount, description, expenseDate }) {
        // Kiểm tra các trường bắt buộc
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }
        if (!categoryId) {
            throw { status: 400, message: "categoryId is required" };
        }
        if (!amount || amount <= 0) {
            throw { status: 400, message: "amount must be a positive number" };
        }
        if (!expenseDate) {
            throw { status: 400, message: "expenseDate is required" };
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

        // Tạo expense
        const expense = await ExpenseModel.create({
            householdId,
            userId,
            categoryId,
            amount,
            description: description ? description.trim() : null,
            expenseDate
        });

        return expense;
    },

    /**
     * Lấy danh sách expenses theo household — chỉ thành viên mới xem được
     */
    async getExpensesByHousehold(userId, householdId) {
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
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

        const expenses = await ExpenseModel.findByHouseholdId(householdId);
        return expenses;
    },

    /**
     * Cập nhật expense — chỉ người tạo hoặc owner/admin của household mới được cập nhật
     */
    async updateExpense(userId, expenseId, { categoryId, amount, description, expenseDate }) {
        // Kiểm tra expense tồn tại
        const expense = await ExpenseModel.findById(expenseId);
        if (!expense) {
            throw { status: 404, message: "Expense not found" };
        }

        // Kiểm tra quyền: người tạo expense HOẶC owner/admin của household
        if (expense.user_id !== userId) {
            const role = await HouseholdModel.getMemberRole(expense.household_id, userId);
            if (!role || !["owner", "admin"].includes(role)) {
                throw { status: 403, message: "You do not have permission to update this expense" };
            }
        }

        // Validate dữ liệu
        if (!categoryId) {
            throw { status: 400, message: "categoryId is required" };
        }
        if (!amount || amount <= 0) {
            throw { status: 400, message: "amount must be a positive number" };
        }
        if (!expenseDate) {
            throw { status: 400, message: "expenseDate is required" };
        }

        // Kiểm tra category tồn tại
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            throw { status: 404, message: "Category not found" };
        }

        await ExpenseModel.updateById(expenseId, {
            categoryId,
            amount,
            description: description ? description.trim() : null,
            expenseDate
        });

        return {
            id: expenseId,
            category_id: categoryId,
            amount,
            description: description ? description.trim() : null,
            expense_date: expenseDate
        };
    },

    /**
     * Xóa expense — chỉ người tạo hoặc owner/admin của household mới được xóa
     */
    async deleteExpense(userId, expenseId) {
        // Kiểm tra expense tồn tại
        const expense = await ExpenseModel.findById(expenseId);
        if (!expense) {
            throw { status: 404, message: "Expense not found" };
        }

        // Kiểm tra quyền: người tạo expense HOẶC owner/admin của household
        if (expense.user_id !== userId) {
            const role = await HouseholdModel.getMemberRole(expense.household_id, userId);
            if (!role || !["owner", "admin"].includes(role)) {
                throw { status: 403, message: "You do not have permission to delete this expense" };
            }
        }

        await ExpenseModel.deleteById(expenseId);
        return { message: "Expense deleted successfully" };
    }
};

module.exports = ExpenseService;

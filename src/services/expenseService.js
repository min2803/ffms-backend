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
     * Lấy danh sách expenses theo household — hỗ trợ type (personal/family) và transform dữ liệu
     */
    async getExpensesByHousehold(userId, householdId, type = "family") {
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }

        // Kiểm tra household tồn tại
        const household = await HouseholdModel.findById(householdId);
        if (!household) {
            throw { status: 404, message: "Household not found" };
        }

        // Kiểm tra user là thành viên
        const members = await HouseholdModel.findMembersByHousehold(householdId);
        const currentUserMember = members.find(m => m.user_id === userId);
        if (!currentUserMember) {
            throw { status: 403, message: "You are not a member of this household" };
        }

        // Lấy tất cả chi phí của household
        let expenses = await ExpenseModel.findByHouseholdId(householdId);

        // Filter nếu là personal
        if (type === "personal") {
            expenses = expenses.filter(e => e.user_id === userId);
        }

        // TRANSFORM DỮ LIỆU SANG CẤU TRÚC FRONTEND MONG ĐỢI
        const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        
        // Giả lập phân loại fixed/variable/unplanned (vì DB chưa có trường này)
        const summary = {
            total: total,
            fixed: total * 0.4,
            variable: total * 0.4,
            unplanned: total * 0.2,
            sharedBudget: total * 1.2, // Giả lập budget
            dailyAverage: total / 30
        };

        // Tính allocations/categories percent
        const categoryMap = {};
        expenses.forEach(e => {
            if (!categoryMap[e.category_id]) {
                categoryMap[e.category_id] = { name: e.category_name, amount: 0 };
            }
            categoryMap[e.category_id].amount += parseFloat(e.amount);
        });

        const allocations = Object.values(categoryMap).map(c => ({
            category: c.name,
            amount: c.amount,
            percent: total > 0 ? Math.round((c.amount / total) * 100) : 0,
            color: "bg-blue-500" // Mặc định
        }));

        // Tính member contributions
        const memberMap = {};
        members.forEach(m => {
            memberMap[m.user_id] = { name: m.name, role: m.role, amount: 0 };
        });
        expenses.forEach(e => {
            if (memberMap[e.user_id]) {
                memberMap[e.user_id].amount += parseFloat(e.amount);
            }
        });

        const memberContributions = Object.values(memberMap).map(m => ({
            name: m.name,
            role: m.role,
            amount: m.amount,
            percent: total > 0 ? Math.round((m.amount / total) * 100) : 0
        }));

        // Transactions format
        const transactions = expenses.map(e => ({
            id: e.id,
            title: e.description || e.category_name,
            subtitle: e.user_name,
            category: e.category_name,
            amount: parseFloat(e.amount),
            date: new Date(e.expense_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            status: "Completed",
            icon: "ShoppingCart" // Mặc định
        }));

        return {
            summary,
            allocations, // Cho PersonalView
            categories: allocations, // Cho FamilyView
            members: memberContributions,
            transactions
        };
    },

    /**
     * Lấy chi tiết expense theo ID — user phải là thành viên của household
     */
    async getExpenseById(userId, expenseId) {
        // Kiểm tra expense tồn tại
        const expense = await ExpenseModel.findByIdWithDetails(expenseId);
        if (!expense) {
            throw { status: 404, message: "Expense not found" };
        }

        // Kiểm tra user là thành viên của household chứa expense
        const member = await HouseholdModel.findMember(expense.household_id, userId);
        if (!member) {
            throw { status: 403, message: "You are not a member of this household" };
        }

        return expense;
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

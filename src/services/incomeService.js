const IncomeModel = require("../models/incomeModel");
const HouseholdModel = require("../models/householdModel");

const IncomeService = {
    /**
     * Tạo income mới — user phải là thành viên của household
     */
    async createIncome(userId, { householdId, amount, source, description, incomeDate }) {
        // Kiểm tra các trường bắt buộc
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }
        if (!amount || amount <= 0) {
            throw { status: 400, message: "amount must be a positive number" };
        }
        if (!source || source.trim().length === 0) {
            throw { status: 400, message: "source is required" };
        }
        if (!incomeDate) {
            throw { status: 400, message: "incomeDate is required" };
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

        // Tạo income
        const income = await IncomeModel.create({
            householdId,
            userId,
            amount,
            source: source.trim(),
            description: description ? description.trim() : null,
            incomeDate
        });

        return income;
    },

    /**
     * Lấy danh sách incomes theo household — chỉ thành viên mới xem được
     */
    async getIncomesByHousehold(userId, householdId) {
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

        const incomes = await IncomeModel.findByHouseholdId(householdId);
        return incomes;
    },

    /**
     * Xóa income — chỉ người tạo hoặc owner/admin của household mới được xóa
     */
    async deleteIncome(userId, incomeId) {
        // Kiểm tra income tồn tại
        const income = await IncomeModel.findById(incomeId);
        if (!income) {
            throw { status: 404, message: "Income not found" };
        }

        // Kiểm tra quyền: người tạo income HOẶC owner/admin của household
        if (income.user_id !== userId) {
            const role = await HouseholdModel.getMemberRole(income.household_id, userId);
            if (!role || !["owner", "admin"].includes(role)) {
                throw { status: 403, message: "You do not have permission to delete this income" };
            }
        }

        await IncomeModel.deleteById(incomeId);
        return { message: "Income deleted successfully" };
    },

    /**
     * Lấy chi tiết income theo ID — user phải là thành viên của household
     */
    async getIncomeById(userId, incomeId) {
        // Kiểm tra income tồn tại
        const income = await IncomeModel.findByIdWithDetails(incomeId);
        if (!income) {
            throw { status: 404, message: "Income not found" };
        }

        // Kiểm tra user là thành viên của household chứa income
        const member = await HouseholdModel.findMember(income.household_id, userId);
        if (!member) {
            throw { status: 403, message: "You are not a member of this household" };
        }

        return income;
    },

    /**
     * Cập nhật income — chỉ người tạo hoặc owner/admin của household mới được cập nhật
     */
    async updateIncome(userId, incomeId, { amount, source, description, incomeDate }) {
        // Kiểm tra income tồn tại
        const income = await IncomeModel.findById(incomeId);
        if (!income) {
            throw { status: 404, message: "Income not found" };
        }

        // Kiểm tra quyền: người tạo income HOẶC owner/admin của household
        if (income.user_id !== userId) {
            const role = await HouseholdModel.getMemberRole(income.household_id, userId);
            if (!role || !["owner", "admin"].includes(role)) {
                throw { status: 403, message: "You do not have permission to update this income" };
            }
        }

        // Validate dữ liệu
        if (!amount || amount <= 0) {
            throw { status: 400, message: "amount must be a positive number" };
        }
        if (!source || source.trim().length === 0) {
            throw { status: 400, message: "source is required" };
        }
        if (!incomeDate) {
            throw { status: 400, message: "incomeDate is required" };
        }

        await IncomeModel.updateById(incomeId, {
            amount,
            source: source.trim(),
            description: description ? description.trim() : null,
            incomeDate
        });

        return {
            id: incomeId,
            amount,
            source: source.trim(),
            description: description ? description.trim() : null,
            income_date: incomeDate
        };
    }
};

module.exports = IncomeService;

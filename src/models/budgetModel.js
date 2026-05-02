const db = require("../config/db");

const BudgetModel = {
    /**
     * Tạo budget mới
     */
    async create({ householdId, categoryId, month, year, amount }) {
        const [result] = await db.execute(
            `INSERT INTO budgets (household_id, category_id, month, year, amount)
             VALUES (?, ?, ?, ?, ?)`,
            [householdId, categoryId, month, year, amount]
        );

        return {
            id: result.insertId,
            household_id: householdId,
            category_id: categoryId,
            month,
            year,
            amount,
            created_at: new Date()
        };
    },

    /**
     * Lấy budgets theo household và tháng/năm
     */
    async findByHouseholdAndMonth(householdId, month, year) {
        const [rows] = await db.execute(
            `SELECT b.*, c.name AS category_name
             FROM budgets b
             JOIN categories c ON b.category_id = c.id
             WHERE b.household_id = ? AND b.month = ? AND b.year = ?
             ORDER BY c.name ASC`,
            [householdId, month, year]
        );
        return rows;
    },

    /**
     * Lấy budgets tháng hiện tại (server time)
     */
    async findCurrentMonth(householdId) {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        return this.findByHouseholdAndMonth(householdId, month, year);
    },

    /**
     * Lấy lịch sử budgets — nhóm theo tháng/năm, sort giảm dần
     */
    async findHistory(householdId, limit = 12, offset = 0) {
        const [rows] = await db.execute(
            `SELECT b.month, b.year,
                    COUNT(b.id) AS category_count,
                    SUM(b.amount) AS total_amount,
                    MIN(b.created_at) AS created_at
             FROM budgets b
             WHERE b.household_id = ?
             GROUP BY b.month, b.year
             ORDER BY b.year DESC, b.month DESC
             LIMIT ? OFFSET ?`,
            [householdId, limit, offset]
        );
        return rows;
    },

    /**
     * Lấy chi tiết budgets cho 1 tháng cụ thể (dùng cho history detail)
     */
    async findDetailByYearMonth(householdId, year, month) {
        const [rows] = await db.execute(
            `SELECT b.*, c.name AS category_name
             FROM budgets b
             JOIN categories c ON b.category_id = c.id
             WHERE b.household_id = ? AND b.year = ? AND b.month = ?
             ORDER BY c.name ASC`,
            [householdId, year, month]
        );
        return rows;
    },

    /**
     * Kiểm tra budget đã tồn tại chưa (tránh trùng lặp)
     */
    async findExisting(householdId, categoryId, month, year) {
        const [rows] = await db.execute(
            `SELECT * FROM budgets
             WHERE household_id = ? AND category_id = ? AND month = ? AND year = ?`,
            [householdId, categoryId, month, year]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Tìm budget theo ID
     */
    async findById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM budgets WHERE id = ?",
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Tìm budget theo ID kèm thông tin category
     */
    async findByIdWithDetails(id) {
        const [rows] = await db.execute(
            `SELECT b.*, c.name AS category_name
             FROM budgets b
             JOIN categories c ON b.category_id = c.id
             WHERE b.id = ?`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Cập nhật budget theo ID
     */
    async updateById(id, { amount }) {
        await db.execute(
            "UPDATE budgets SET amount = ? WHERE id = ?",
            [amount, id]
        );
        return this.findByIdWithDetails(id);
    },

    /**
     * Xóa budget theo ID
     */
    async deleteById(id) {
        const [result] = await db.execute(
            "DELETE FROM budgets WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    },

    /**
     * Lấy tất cả household_id có budget ở tháng cụ thể
     */
    async getHouseholdsWithBudgetForMonth(month, year) {
        const [rows] = await db.execute(
            `SELECT DISTINCT household_id FROM budgets WHERE month = ? AND year = ?`,
            [month, year]
        );
        return rows.map(r => r.household_id);
    }
};

module.exports = BudgetModel;

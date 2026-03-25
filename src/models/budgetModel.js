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
     * Kiểm tra budget đã tồn tại chưa (tránh trùng lặp)
     */
    async findExisting(householdId, categoryId, month, year) {
        const [rows] = await db.execute(
            `SELECT * FROM budgets
             WHERE household_id = ? AND category_id = ? AND month = ? AND year = ?`,
            [householdId, categoryId, month, year]
        );
        return rows.length > 0 ? rows[0] : null;
    }
};

module.exports = BudgetModel;

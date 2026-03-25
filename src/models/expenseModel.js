const db = require("../config/db");

const ExpenseModel = {
    /**
     * Tạo expense mới
     */
    async create({ householdId, userId, categoryId, amount, description, expenseDate }) {
        const [result] = await db.execute(
            `INSERT INTO expenses (household_id, user_id, category_id, amount, description, expense_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [householdId, userId, categoryId, amount, description || null, expenseDate]
        );

        return {
            id: result.insertId,
            household_id: householdId,
            user_id: userId,
            category_id: categoryId,
            amount,
            description: description || null,
            expense_date: expenseDate,
            created_at: new Date()
        };
    },

    /**
     * Lấy danh sách expenses theo household
     */
    async findByHouseholdId(householdId) {
        const [rows] = await db.execute(
            `SELECT e.*, u.name AS user_name, u.email AS user_email,
                    c.name AS category_name
             FROM expenses e
             JOIN users u ON e.user_id = u.id
             JOIN categories c ON e.category_id = c.id
             WHERE e.household_id = ?
             ORDER BY e.expense_date DESC`,
            [householdId]
        );
        return rows;
    },

    /**
     * Tìm expense theo ID
     */
    async findById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM expenses WHERE id = ?",
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Tính tổng chi tiêu theo category trong một tháng cụ thể
     * Dùng để tính budget usage percentage
     */
    async getTotalByCategory(householdId, categoryId, month, year) {
        const [rows] = await db.execute(
            `SELECT COALESCE(SUM(amount), 0) AS total
             FROM expenses
             WHERE household_id = ? AND category_id = ?
               AND MONTH(expense_date) = ? AND YEAR(expense_date) = ?`,
            [householdId, categoryId, month, year]
        );
        return parseFloat(rows[0].total);
    },

    /**
     * Cập nhật expense theo ID
     */
    async updateById(id, { categoryId, amount, description, expenseDate }) {
        const [result] = await db.execute(
            `UPDATE expenses SET category_id = ?, amount = ?, description = ?, expense_date = ?
             WHERE id = ?`,
            [categoryId, amount, description || null, expenseDate, id]
        );
        return result.affectedRows > 0;
    },

    /**
     * Xóa expense theo ID
     */
    async deleteById(id) {
        const [result] = await db.execute(
            "DELETE FROM expenses WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = ExpenseModel;

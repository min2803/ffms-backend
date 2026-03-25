const db = require("../config/db");

const IncomeModel = {
    /**
     * Tạo income mới
     */
    async create({ householdId, userId, amount, source, description, incomeDate }) {
        const [result] = await db.execute(
            `INSERT INTO incomes (household_id, user_id, amount, source, description, income_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [householdId, userId, amount, source, description || null, incomeDate]
        );

        return {
            id: result.insertId,
            household_id: householdId,
            user_id: userId,
            amount,
            source,
            description: description || null,
            income_date: incomeDate,
            created_at: new Date()
        };
    },

    /**
     * Lấy danh sách incomes theo household
     */
    async findByHouseholdId(householdId) {
        const [rows] = await db.execute(
            `SELECT i.*, u.name AS user_name, u.email AS user_email
             FROM incomes i
             JOIN users u ON i.user_id = u.id
             WHERE i.household_id = ?
             ORDER BY i.income_date DESC`,
            [householdId]
        );
        return rows;
    },

    /**
     * Tìm income theo ID
     */
    async findById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM incomes WHERE id = ?",
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Cập nhật income theo ID
     */
    async updateById(id, { amount, source, description, incomeDate }) {
        const [result] = await db.execute(
            `UPDATE incomes SET amount = ?, source = ?, description = ?, income_date = ?
             WHERE id = ?`,
            [amount, source, description || null, incomeDate, id]
        );
        return result.affectedRows > 0;
    },

    /**
     * Xóa income theo ID
     */
    async deleteById(id) {
        const [result] = await db.execute(
            "DELETE FROM incomes WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = IncomeModel;

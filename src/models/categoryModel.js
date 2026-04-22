const db = require("../config/db");

const CategoryModel = {
    async findById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM categories WHERE id = ?",
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Lấy tất cả categories của một household
     */
    async findAllByHousehold(householdId) {
        const [rows] = await db.execute(
            "SELECT * FROM categories WHERE household_id = ? ORDER BY name ASC",
            [householdId]
        );
        return rows;
    },

    /**
     * Tạo category mới cho household
     */
    async create({ householdId, name, type }, conn = null) {
        const executor = conn || db;
        const [result] = await executor.execute(
            "INSERT INTO categories (household_id, name, type) VALUES (?, ?, ?)",
            [householdId, name, type || null]
        );
        return {
            id: result.insertId,
            household_id: householdId,
            name,
            type: type || null,
            created_at: new Date()
        };
    },

    /**
     * Cập nhật category
     */
    async updateById(id, { name, type }) {
        const [result] = await db.execute(
            "UPDATE categories SET name = ?, type = ? WHERE id = ?",
            [name, type || null, id]
        );
        return result.affectedRows > 0;
    },

    /**
     * Xóa category
     */
    async deleteById(id) {
        const [result] = await db.execute(
            "DELETE FROM categories WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    },

    /**
     * Tìm category theo tên trong một household (kiểm tra trùng lặp)
     */
    async findByName(householdId, name) {
        const [rows] = await db.execute(
            "SELECT * FROM categories WHERE household_id = ? AND name = ?",
            [householdId, name]
        );
        return rows.length > 0 ? rows[0] : null;
    }
};

module.exports = CategoryModel;

const db = require("../config/db");

const CategoryModel = {
    /**
     * Tìm category theo ID
     */
    async findById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM categories WHERE id = ?",
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Lấy tất cả categories
     */
    async findAll() {
        const [rows] = await db.execute("SELECT * FROM categories ORDER BY name ASC");
        return rows;
    },

    /**
     * Tạo category mới
     */
    async create({ name, type }) {
        const [result] = await db.execute(
            "INSERT INTO categories (name, type) VALUES (?, ?)",
            [name, type || null]
        );
        return {
            id: result.insertId,
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
     * Tìm category theo tên (kiểm tra trùng lặp)
     */
    async findByName(name) {
        const [rows] = await db.execute(
            "SELECT * FROM categories WHERE name = ?",
            [name]
        );
        return rows.length > 0 ? rows[0] : null;
    }
};

module.exports = CategoryModel;

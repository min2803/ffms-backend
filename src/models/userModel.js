const db = require("../config/db");

const UserModel = {
    /**
     * Tìm user theo email
     */
    async findByEmail(email) {
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Tạo user mới
     */
    async create({ name, email, password, role = "user" }) {
        const [result] = await db.execute(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
            [name, email, password, role]
        );

        // Trả về user đã tạo (không kèm password)
        return {
            id: result.insertId,
            name,
            email,
            role,
            created_at: new Date()
        };
    },

    /**
     * Tìm user theo ID
     */
    async findById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Lấy danh sách tất cả user (không kèm password)
     */
    async findAll() {
        const [rows] = await db.execute(
            "SELECT id, name, email, role, created_at, updated_at FROM users"
        );
        return rows;
    },

    /**
     * Cập nhật thông tin user theo ID
     */
    async updateById(id, fields) {
        const keys = Object.keys(fields);
        if (keys.length === 0) return this.findById(id);

        const setClause = keys.map((key) => `${key} = ?`).join(", ");
        const values = keys.map((key) => fields[key]);

        await db.execute(
            `UPDATE users SET ${setClause} WHERE id = ?`,
            [...values, id]
        );

        return this.findById(id);
    },

    /**
     * Xóa user theo ID
     */
    async deleteById(id) {
        const [result] = await db.execute(
            "DELETE FROM users WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = UserModel;

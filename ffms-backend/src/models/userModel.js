const db = require("../config/db");

const UserModel = {
    /**
     * Tìm user theo email (JOIN roles để lấy role_name)
     */
    async findByEmail(email) {
        const [rows] = await db.execute(
            `SELECT u.*, r.role_name 
             FROM users u 
             LEFT JOIN roles r ON u.role_id = r.id 
             WHERE u.email = ?`,
            [email]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Tạo user mới (mặc định role_id = 2 → user)
     */
    async create({ name, email, password }, conn = null) {
        const executor = conn || db;
        const [result] = await executor.execute(
            "INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, 2)",
            [name, email, password]
        );

        // Trả về user đã tạo (không kèm password)
        return {
            id: result.insertId,
            name,
            email,
            role_name: "user",
            created_at: new Date()
        };
    },

    /**
     * Tìm user theo ID (JOIN roles để lấy role_name)
     */
    async findById(id) {
        const [rows] = await db.execute(
            `SELECT u.*, r.role_name 
             FROM users u 
             LEFT JOIN roles r ON u.role_id = r.id 
             WHERE u.id = ?`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Lấy danh sách tất cả user (không kèm password, JOIN roles)
     */
    async findAll() {
        const [rows] = await db.execute(
            `SELECT u.id, u.name, u.email, u.role_id, r.role_name, u.created_at, u.updated_at 
             FROM users u 
             LEFT JOIN roles r ON u.role_id = r.id`
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

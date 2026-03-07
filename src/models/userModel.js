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
    async create({ name, email, password }) {
        const [result] = await db.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, password]
        );

        // Trả về user đã tạo (không kèm password)
        return {
            id: result.insertId,
            name,
            email,
            created_at: new Date()
        };
    }
};

module.exports = UserModel;

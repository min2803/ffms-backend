const db = require("../config/db");

const ALLOWED_UPDATE_FIELDS = ["name", "email", "role_id", "household_id", "password_hash", "display_id", "full_name", "phone_number", "date_of_birth"];

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
     * Tạo random 5 chữ số display_id, đảm bảo unique
     */
    async generateDisplayId(conn = null) {
        const executor = conn || db;
        let displayId;
        let attempts = 0;
        const MAX_ATTEMPTS = 20;

        do {
            // Random 5 chữ số: 10000 → 99999
            displayId = String(Math.floor(10000 + Math.random() * 90000));
            const [existing] = await executor.execute(
                "SELECT id FROM users WHERE display_id = ?",
                [displayId]
            );
            if (existing.length === 0) return displayId;
            attempts++;
        } while (attempts < MAX_ATTEMPTS);

        // Fallback: timestamp-based
        return String(Date.now()).slice(-5);
    },

    /**
     * Tạo user mới (mặc định role_id = 2 → user)
     * Tự động generate display_id (random 5 chữ số)
     */
    async create({ name, email, password }, conn = null) {
        const executor = conn || db;

        // Generate unique display_id
        const displayId = await this.generateDisplayId(executor);

        const [result] = await executor.execute(
            "INSERT INTO users (name, email, password_hash, role_id, display_id) VALUES (?, ?, ?, 2, ?)",
            [name, email, password, displayId]
        );

        // Trả về user đã tạo (không kèm password)
        return {
            id: result.insertId,
            display_id: displayId,
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
            `SELECT u.id, u.display_id, u.name, u.email, u.role_id, r.role_name, u.created_at, u.updated_at 
             FROM users u 
             LEFT JOIN roles r ON u.role_id = r.id`
        );
        return rows;
    },

    /**
     * Cập nhật thông tin user theo ID
     */
    async updateById(id, fields) {
        const keys = Object.keys(fields).filter((k) => ALLOWED_UPDATE_FIELDS.includes(k));
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
     * Tìm user theo keyword (display_id, name hoặc email) — dùng cho invite member
     * Nếu keyword là số thuần, ưu tiên tìm theo display_id
     */
    async searchByKeyword(keyword, limit = 10) {
        const pattern = `%${keyword}%`;
        const safeLimit = Math.max(1, Math.min(Number(limit) || 10, 50));
        const isNumeric = /^\d+$/.test(keyword);

        if (isNumeric) {
            // Search by display_id (exact or partial) + fallback to name/email LIKE
            const [rows] = await db.execute(
                `SELECT id, display_id, name, email FROM users
                 WHERE display_id = ? OR display_id LIKE ? OR name LIKE ? OR email LIKE ?
                 ORDER BY CASE WHEN display_id = ? THEN 0 ELSE 1 END, name ASC
                 LIMIT ${safeLimit}`,
                [keyword, pattern, pattern, pattern, keyword]
            );
            return rows;
        }

        const [rows] = await db.execute(
            `SELECT id, display_id, name, email FROM users
             WHERE display_id LIKE ? OR name LIKE ? OR email LIKE ?
             ORDER BY name ASC
             LIMIT ${safeLimit}`,
            [pattern, pattern, pattern]
        );
        return rows;
    },

    /**
     * Backfill: Cấp display_id cho user chưa có
     */
    async backfillDisplayIds() {
        const [rows] = await db.execute(
            "SELECT id FROM users WHERE display_id IS NULL"
        );
        let count = 0;
        for (const row of rows) {
            const displayId = await this.generateDisplayId();
            await db.execute(
                "UPDATE users SET display_id = ? WHERE id = ? AND display_id IS NULL",
                [displayId, row.id]
            );
            count++;
        }
        return count;
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

const db = require("../config/db");

const RefreshTokenModel = {
    /**
     * Lưu refresh token vào database
     */
    async create(userId, token, expiresAt) {
        await db.execute(
            "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
            [userId, token, expiresAt]
        );
    },

    /**
     * Tìm refresh token
     */
    async findByToken(token) {
        const [rows] = await db.execute(
            "SELECT * FROM refresh_tokens WHERE token = ?",
            [token]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Xóa refresh token (khi logout hoặc khi refresh)
     */
    async deleteByToken(token) {
        await db.execute(
            "DELETE FROM refresh_tokens WHERE token = ?",
            [token]
        );
    },

    /**
     * Xóa tất cả refresh token của user (khi logout khỏi tất cả thiết bị)
     */
    async deleteByUserId(userId) {
        await db.execute(
            "DELETE FROM refresh_tokens WHERE user_id = ?",
            [userId]
        );
    },

    /**
     * Xóa các refresh token đã hết hạn
     */
    async deleteExpired() {
        await db.execute(
            "DELETE FROM refresh_tokens WHERE expires_at < NOW()"
        );
    }
};

module.exports = RefreshTokenModel;

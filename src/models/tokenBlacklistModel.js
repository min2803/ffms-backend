const db = require("../config/db");

const TokenBlacklistModel = {
    /**
     * Thêm token vào danh sách đen (blacklist)
     */
    async add(token, expiresAt) {
        await db.execute(
            "INSERT IGNORE INTO token_blacklist (token, expires_at) VALUES (?, ?)",
            [token, expiresAt]
        );
    },

    /**
     * Kiểm tra token có nằm trong danh sách đen không
     */
    async isBlacklisted(token) {
        const [rows] = await db.execute(
            "SELECT id FROM token_blacklist WHERE token = ?",
            [token]
        );
        return rows.length > 0;
    }
};

module.exports = TokenBlacklistModel;

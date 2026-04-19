const db = require("../config/db");

const NotificationModel = {
    /**
     * Tạo notification mới
     */
    async create(userId, type, message) {
        const [result] = await db.execute(
            `INSERT INTO notifications (user_id, type, message)
             VALUES (?, ?, ?)`,
            [userId, type, message]
        );

        return {
            id: result.insertId,
            user_id: userId,
            type,
            message,
            is_read: false,
            created_at: new Date()
        };
    },

    /**
     * Lấy danh sách notifications theo user
     */
    async findByUserId(userId) {
        const [rows] = await db.execute(
            `SELECT * FROM notifications
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );
        return rows;
    },

    /**
     * Tìm notification theo ID
     */
    async findById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM notifications WHERE id = ?",
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Đánh dấu đã đọc
     */
    async markAsRead(id) {
        const [result] = await db.execute(
            "UPDATE notifications SET is_read = true WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = NotificationModel;

const db = require("../config/db");

const NotificationModel = {
    /**
     * Tạo notification mới
     * DB columns: user_id, title, message, read_status
     */
    async create(userId, title, message) {
        const [result] = await db.execute(
            `INSERT INTO notifications (user_id, title, message)
             VALUES (?, ?, ?)`,
            [userId, title, message]
        );

        return {
            id: result.insertId,
            user_id: userId,
            title,
            message,
            is_read: false,
            read_status: 0,
            created_at: new Date()
        };
    },

    /**
     * Lấy danh sách notifications theo user
     * Map read_status → is_read cho frontend compatibility
     */
    async findByUserId(userId) {
        const [rows] = await db.execute(
            `SELECT id, user_id, title, message, read_status, 
                    (read_status = 1) AS is_read, created_at
             FROM notifications
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
            `SELECT id, user_id, title, message, read_status,
                    (read_status = 1) AS is_read, created_at
             FROM notifications WHERE id = ?`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Đánh dấu đã đọc
     */
    async markAsRead(id) {
        const [result] = await db.execute(
            "UPDATE notifications SET read_status = 1 WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = NotificationModel;

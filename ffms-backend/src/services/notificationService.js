const NotificationModel = require("../models/notificationModel");

const NotificationService = {
    /**
     * Tạo notification — reusable, gọi từ bất kỳ service nào
     * Wrap trong try/catch riêng: fail không ảnh hưởng logic chính
     */
    async create(userId, type, message) {
        try {
            return await NotificationModel.create(userId, type, message);
        } catch (error) {
            console.error("Notification create error (non-blocking):", error.message);
            return null;
        }
    },

    /**
     * GET /api/notifications
     * Lấy danh sách notifications của user hiện tại
     */
    async getByUser(userId) {
        return await NotificationModel.findByUserId(userId);
    },

    /**
     * PUT /api/notifications/:id/read
     * Đánh dấu đã đọc — kiểm tra ownership
     */
    async markAsRead(userId, notificationId) {
        const notification = await NotificationModel.findById(notificationId);
        if (!notification) {
            throw { status: 404, message: "Notification not found" };
        }

        if (notification.user_id !== userId) {
            throw { status: 403, message: "You do not have permission to update this notification" };
        }

        await NotificationModel.markAsRead(notificationId);
        return { id: notificationId, is_read: true };
    },

    /**
     * POST /api/notifications (admin)
     * Admin tạo notification thủ công cho user
     */
    async createManual({ userId, type, message }) {
        if (!userId) {
            throw { status: 400, message: "userId is required" };
        }
        if (!type || type.trim().length === 0) {
            throw { status: 400, message: "type is required" };
        }
        if (!message || message.trim().length === 0) {
            throw { status: 400, message: "message is required" };
        }

        return await NotificationModel.create(userId, type.trim(), message.trim());
    }
};

module.exports = NotificationService;

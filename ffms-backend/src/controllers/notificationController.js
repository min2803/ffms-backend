const NotificationService = require("../services/notificationService");

const NotificationController = {
    /**
     * GET /api/notifications
     * Lấy danh sách notifications của user hiện tại
     */
    async getNotifications(req, res) {
        try {
            const userId = req.user.userId;

            const data = await NotificationService.getByUser(userId);

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            console.error("Get notifications error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * PUT /api/notifications/:id/read
     * Đánh dấu notification đã đọc
     */
    async markAsRead(req, res) {
        try {
            const userId = req.user.userId;
            const notificationId = parseInt(req.params.id);

            if (isNaN(notificationId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid notification ID"
                });
            }

            const data = await NotificationService.markAsRead(userId, notificationId);

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Mark notification read error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * POST /api/notifications (admin only)
     * Tạo notification thủ công
     */
    async createNotification(req, res) {
        try {
            const { userId, type, message } = req.body;

            const data = await NotificationService.createManual({
                userId: userId ? parseInt(userId) : null,
                type,
                message
            });

            return res.status(201).json({
                success: true,
                data
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Create notification error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = NotificationController;

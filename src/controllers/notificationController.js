const NotificationService = require("../services/notificationService");
const { handleRequest } = require("../utils/controllerHandler");

const NotificationController = {
    getNotifications: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const data = await NotificationService.getByUser(userId);
        return res.status(200).json({ success: true, data });
    }, "Get notifications"),

    markAsRead: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const notificationId = parseInt(req.params.id);

        if (isNaN(notificationId)) {
            return res.status(400).json({ success: false, message: "Invalid notification ID" });
        }

        const data = await NotificationService.markAsRead(userId, notificationId);
        return res.status(200).json({ success: true, data });
    }, "Mark notification read"),

    createNotification: handleRequest(async (req, res) => {
        const { userId, type, message } = req.body;

        const data = await NotificationService.createManual({
            userId: userId ? parseInt(userId) : null,
            type,
            message
        });

        return res.status(201).json({ success: true, data });
    }, "Create notification")
};

module.exports = NotificationController;

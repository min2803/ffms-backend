const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notificationController");
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");

// Lấy danh sách notifications của user hiện tại
router.get("/", verifyToken, NotificationController.getNotifications);

// Đánh dấu notification đã đọc
router.put("/:id/read", verifyToken, NotificationController.markAsRead);

// Tạo notification thủ công (admin only)
router.post("/", verifyToken, authorizeRole("admin"), NotificationController.createNotification);

module.exports = router;

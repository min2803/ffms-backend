const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");

// Tất cả routes yêu cầu admin role
router.use(verifyToken, authorizeRole("admin"));

// Tổng quan hệ thống
router.get("/summary", AdminController.getSummary);

// Quản lý users
router.get("/users", AdminController.getUsers);
router.delete("/users/:id", AdminController.deleteUser);
router.put("/users/:id/role", AdminController.updateUserRole);

// Quản lý households
router.get("/households", AdminController.getHouseholds);
router.delete("/households/:id", AdminController.deleteHousehold);

// System
router.get("/system/health", AdminController.getHealth);
router.get("/system/logs", AdminController.getLogs);
router.get("/system/metrics", AdminController.getMetrics);

module.exports = router;

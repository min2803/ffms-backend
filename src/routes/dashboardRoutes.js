const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/dashboardController");
const { verifyToken, requireHousehold } = require("../middlewares/authMiddleware");

// Tổng quan tài chính (tháng hiện tại hoặc theo month/year)
router.get("/summary", verifyToken, requireHousehold, DashboardController.getSummary);

// So sánh thu chi theo khoảng thời gian
router.get("/compare", verifyToken, requireHousehold, DashboardController.getCompare);

module.exports = router;

const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/reportController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Báo cáo chi tiêu theo danh mục
router.get("/expense-category", verifyToken, ReportController.getExpenseByCategory);

// Báo cáo tài chính tổng hợp
router.get("/financial", verifyToken, ReportController.getFinancial);

// Xu hướng thu/chi theo ngày hoặc tháng
router.get("/trend", verifyToken, ReportController.getTrend);

// Chi tiết thu/chi
router.get("/detail", verifyToken, ReportController.getDetail);

module.exports = router;

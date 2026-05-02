const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/reportController");
const { verifyToken, requireHousehold } = require("../middlewares/authMiddleware");

// Báo cáo chi tiêu theo danh mục
router.get("/expense-category", verifyToken, requireHousehold, ReportController.getExpenseByCategory);

// Báo cáo tài chính tổng hợp
router.get("/financial", verifyToken, requireHousehold, ReportController.getFinancial);

// Xu hướng thu/chi theo ngày hoặc tháng
router.get("/trend", verifyToken, requireHousehold, ReportController.getTrend);

// Chi tiết thu/chi
router.get("/detail", verifyToken, requireHousehold, ReportController.getDetail);

module.exports = router;

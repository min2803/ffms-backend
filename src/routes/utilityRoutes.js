const express = require("express");
const router = express.Router();
const UtilityController = require("../controllers/utilityController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Lấy usage summary theo tháng — đặt trước "/" để tránh conflict
router.get("/summary", verifyToken, UtilityController.getUsageSummary);

// Thêm meter reading
router.post("/", verifyToken, UtilityController.addReading);

// Lấy danh sách consumption data
router.get("/", verifyToken, UtilityController.getConsumptionData);

module.exports = router;

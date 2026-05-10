const express = require("express");
const router = express.Router();
const AiController = require("../controllers/aiController");
const { verifyToken, requireHousehold } = require("../middlewares/authMiddleware");

// Dự đoán chi tiêu bằng AI
router.get("/predict", verifyToken, requireHousehold, AiController.getPrediction);

// Kiểm tra AI service status
router.get("/health", AiController.healthCheck);

module.exports = router;

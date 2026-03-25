const express = require("express");
const router = express.Router();
const HouseholdController = require("../controllers/householdController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Tạo household mới
router.post("/", verifyToken, HouseholdController.createHousehold);

// Lấy thông tin household theo ID
router.get("/me/:id", verifyToken, HouseholdController.getHousehold);

// Thêm thành viên vào household
router.post("/:id/members", verifyToken, HouseholdController.addMember);

module.exports = router;

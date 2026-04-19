const express = require("express");
const router = express.Router();
const HouseholdController = require("../controllers/householdController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Tạo household mới
router.post("/", verifyToken, HouseholdController.createHousehold);

// Lấy thông tin household theo ID
router.get("/me/:id", verifyToken, HouseholdController.getHousehold);

// Cập nhật tên household — chỉ owner/admin trong household
router.put("/:id", verifyToken, HouseholdController.updateHousehold);

// Soft delete household — chỉ owner/admin trong household
router.delete("/:id", verifyToken, HouseholdController.deleteHousehold);

// Thêm thành viên vào household — chỉ owner/admin trong household
router.post("/:id/members", verifyToken, HouseholdController.addMember);

// Xóa thành viên khỏi household — chỉ owner/admin trong household
router.delete("/:id/members/:userId", verifyToken, HouseholdController.removeMember);

// Invite member vào household — chỉ owner/admin trong household
router.post("/invite", verifyToken, HouseholdController.inviteMember);

// Thay đổi role thành viên trong household — chỉ owner
router.patch("/members/:id/role", verifyToken, HouseholdController.changeMemberRole);

module.exports = router;

const express = require("express");
const router = express.Router();
const InvitationController = require("../controllers/invitationController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Lấy danh sách invitation pending cho user hiện tại
router.get("/me", verifyToken, InvitationController.getMyInvitations);

// Accept invitation
router.post("/:id/accept", verifyToken, InvitationController.acceptInvitation);

// Reject invitation
router.post("/:id/reject", verifyToken, InvitationController.rejectInvitation);

module.exports = router;

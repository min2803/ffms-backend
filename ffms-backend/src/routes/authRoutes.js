const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Đăng ký
router.post("/register", AuthController.register);

// Đăng nhập
router.post("/login", AuthController.login);

// Đăng xuất — cần xác thực token trước khi cho phép đăng xuất
router.post("/logout", verifyToken, AuthController.logout);

// Refresh token — tạo access token mới từ refresh token
router.post("/refresh", AuthController.refresh);

module.exports = router;

const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const AuthController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again after 15 minutes" }
});

// Đăng ký
router.post("/register", authLimiter, AuthController.register);

// Đăng nhập
router.post("/login", authLimiter, AuthController.login);

// Đăng xuất — cần xác thực token trước khi cho phép đăng xuất
router.post("/logout", verifyToken, AuthController.logout);

// Quên mật khẩu
router.post("/forgot-password", authLimiter, AuthController.forgotPassword);

// Đặt lại mật khẩu
router.post("/reset-password", authLimiter, AuthController.resetPassword);

// Refresh token — tạo access token mới từ refresh token
router.post("/refresh", AuthController.refresh);

module.exports = router;

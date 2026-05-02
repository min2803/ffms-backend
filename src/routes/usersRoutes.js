const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/usersController");
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");

// Cập nhật profile của user đang đăng nhập (name, email) — cần token
router.put("/me", verifyToken, UsersController.updateProfile);

// Đổi mật khẩu của user đang đăng nhập
router.put("/me/password", verifyToken, UsersController.changePassword);

// Lấy thông tin profile của user đang đăng nhập — cần token
router.get("/profile", verifyToken, UsersController.getProfile);

// Tìm user theo keyword (name/email) — cho invite member flow
router.get("/search", verifyToken, UsersController.searchUsers);

// Lấy danh sách tất cả user — Admin only
router.get("/", verifyToken, authorizeRole("admin"), UsersController.getAllUsers);

// Lấy thông tin user theo ID — Admin only
router.get("/:id", verifyToken, authorizeRole("admin"), UsersController.getUserById);

// Cập nhật role của user — Admin only
router.put("/:id", verifyToken, authorizeRole("admin"), UsersController.updateUserRole);

// Xóa user — Admin only
router.delete("/:id", verifyToken, authorizeRole("admin"), UsersController.deleteUser);

module.exports = router;

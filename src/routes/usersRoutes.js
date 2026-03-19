const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/usersController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Lấy danh sách tất cả user
router.get("/", verifyToken, UsersController.getAllUsers);

// Lấy thông tin profile của user đang đăng nhập
router.get("/profile", verifyToken, UsersController.getProfile);

// Cập nhật thông tin profile của user đang đăng nhập
router.put("/profile", verifyToken, UsersController.updateProfile);

module.exports = router;

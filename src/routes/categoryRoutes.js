const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Tạo category mới
router.post("/", verifyToken, CategoryController.createCategory);

// Lấy tất cả categories
router.get("/", verifyToken, CategoryController.getCategories);

// Lấy category theo ID
router.get("/:id", verifyToken, CategoryController.getCategoryById);

// Cập nhật category
router.put("/:id", verifyToken, CategoryController.updateCategory);

// Xóa category
router.delete("/:id", verifyToken, CategoryController.deleteCategory);

module.exports = router;

const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");
const { verifyToken, requireHousehold } = require("../middlewares/authMiddleware");

// Tạo category mới
router.post("/", verifyToken, requireHousehold, CategoryController.createCategory);

// Lấy tất cả categories
router.get("/", verifyToken, requireHousehold, CategoryController.getCategories);

// Lấy category theo ID
router.get("/:id", verifyToken, requireHousehold, CategoryController.getCategoryById);

// Cập nhật category
router.put("/:id", verifyToken, requireHousehold, CategoryController.updateCategory);

// Xóa category
router.delete("/:id", verifyToken, requireHousehold, CategoryController.deleteCategory);

module.exports = router;

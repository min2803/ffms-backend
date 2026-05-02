const express = require("express");
const router = express.Router();
const ExpenseController = require("../controllers/expenseController");
const { verifyToken, requireHousehold } = require("../middlewares/authMiddleware");

// Tạo expense mới
router.post("/", verifyToken, requireHousehold, ExpenseController.createExpense);

// Lấy danh sách expenses theo household
router.get("/", verifyToken, requireHousehold, ExpenseController.getExpenses);

// Lấy chi tiết expense theo ID
router.get("/:id", verifyToken, requireHousehold, ExpenseController.getExpenseById);

// Cập nhật expense
router.put("/:id", verifyToken, requireHousehold, ExpenseController.updateExpense);

// Xóa expense
router.delete("/:id", verifyToken, requireHousehold, ExpenseController.deleteExpense);

module.exports = router;

const express = require("express");
const router = express.Router();
const ExpenseController = require("../controllers/expenseController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Tạo expense mới
router.post("/", verifyToken, ExpenseController.createExpense);

// Lấy danh sách expenses theo household
router.get("/", verifyToken, ExpenseController.getExpenses);

// Cập nhật expense
router.put("/:id", verifyToken, ExpenseController.updateExpense);

// Xóa expense
router.delete("/:id", verifyToken, ExpenseController.deleteExpense);

module.exports = router;

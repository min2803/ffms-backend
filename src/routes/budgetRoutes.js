const express = require("express");
const router = express.Router();
const BudgetController = require("../controllers/budgetController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Tạo budget mới
router.post("/", verifyToken, BudgetController.createBudget);

// Lấy danh sách budgets theo tháng (kèm usage percentage)
router.get("/", verifyToken, BudgetController.getBudgets);

module.exports = router;

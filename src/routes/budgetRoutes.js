const express = require("express");
const router = express.Router();
const BudgetController = require("../controllers/budgetController");
const { verifyToken, requireHousehold } = require("../middlewares/authMiddleware");

// Lấy budget tháng hiện tại (server time)
router.get("/current", verifyToken, requireHousehold, BudgetController.getCurrentBudget);

// Lấy lịch sử budget theo tháng (phân trang)
router.get("/history", verifyToken, requireHousehold, BudgetController.getBudgetHistory);

// Tạo budget mới
router.post("/", verifyToken, requireHousehold, BudgetController.createBudget);

// Lấy danh sách budgets theo tháng (kèm usage percentage)
router.get("/", verifyToken, requireHousehold, BudgetController.getBudgets);

// Cập nhật budget (amount) — chỉ owner/admin trong household
router.put("/:id", verifyToken, requireHousehold, BudgetController.updateBudget);

// Xóa budget — chỉ owner/admin trong household
router.delete("/:id", verifyToken, requireHousehold, BudgetController.deleteBudget);

module.exports = router;

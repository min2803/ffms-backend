const express = require("express");
const router = express.Router();
const IncomeController = require("../controllers/incomeController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Tạo income mới
router.post("/", verifyToken, IncomeController.createIncome);

// Lấy danh sách incomes theo household
router.get("/", verifyToken, IncomeController.getIncomes);

// Lấy chi tiết income theo ID
router.get("/:id", verifyToken, IncomeController.getIncomeById);

// Xóa income
router.delete("/:id", verifyToken, IncomeController.deleteIncome);

// Cập nhật income
router.put("/:id", verifyToken, IncomeController.updateIncome);

module.exports = router;

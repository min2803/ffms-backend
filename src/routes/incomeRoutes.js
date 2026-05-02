const express = require("express");
const router = express.Router();
const IncomeController = require("../controllers/incomeController");
const { verifyToken, requireHousehold } = require("../middlewares/authMiddleware");

// Tạo income mới
router.post("/", verifyToken, requireHousehold, IncomeController.createIncome);

// Lấy danh sách incomes theo household
router.get("/", verifyToken, requireHousehold, IncomeController.getIncomes);

// Lấy chi tiết income theo ID
router.get("/:id", verifyToken, requireHousehold, IncomeController.getIncomeById);

// Xóa income
router.delete("/:id", verifyToken, requireHousehold, IncomeController.deleteIncome);

// Cập nhật income
router.put("/:id", verifyToken, requireHousehold, IncomeController.updateIncome);

module.exports = router;

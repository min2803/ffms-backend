jest.mock("../../models/expenseModel");
jest.mock("../../models/householdModel");
jest.mock("../../models/categoryModel");
jest.mock("../../config/db", () => ({ execute: jest.fn() }));

const ExpenseModel = require("../../models/expenseModel");
const HouseholdModel = require("../../models/householdModel");
const CategoryModel = require("../../models/categoryModel");
const ExpenseService = require("../../services/expenseService");

describe("ExpenseService", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("createExpense", () => {
        test("success", async () => {
            HouseholdModel.findById.mockResolvedValue({ id: 1 });
            HouseholdModel.findMember.mockResolvedValue({ user_id: 1 });
            CategoryModel.findById.mockResolvedValue({ id: 1 });
            ExpenseModel.create.mockResolvedValue({ id: 1, amount: 500000 });

            const result = await ExpenseService.createExpense(1, {
                householdId: 1, categoryId: 1, amount: 500000, expenseDate: "2026-04-01"
            });
            expect(result).toHaveProperty("id");
        });

        test("missing category — throws 400", async () => {
            await expect(ExpenseService.createExpense(1, {
                householdId: 1, amount: 500000, expenseDate: "2026-04-01"
            })).rejects.toEqual(expect.objectContaining({ status: 400, message: "categoryId is required" }));
        });
    });

    describe("getExpensesByHousehold", () => {
        const expenses = [
            { id: 1, user_id: 1, amount: 100 },
            { id: 2, user_id: 2, amount: 200 },
        ];

        test("family type returns all", async () => {
            HouseholdModel.findById.mockResolvedValue({ id: 1 });
            HouseholdModel.findMember.mockResolvedValue({ user_id: 1 });
            ExpenseModel.findByHouseholdId.mockResolvedValue(expenses);

            const result = await ExpenseService.getExpensesByHousehold(1, 1, "family");
            expect(result).toHaveLength(2);
        });

        test("personal type filters by userId", async () => {
            HouseholdModel.findById.mockResolvedValue({ id: 1 });
            HouseholdModel.findMember.mockResolvedValue({ user_id: 1 });
            ExpenseModel.findByHouseholdId.mockResolvedValue(expenses);

            const result = await ExpenseService.getExpensesByHousehold(1, 1, "personal");
            expect(result).toHaveLength(1);
            expect(result[0].user_id).toBe(1);
        });
    });

    describe("deleteExpense", () => {
        test("success", async () => {
            ExpenseModel.findById.mockResolvedValue({ id: 1, user_id: 1, household_id: 1 });
            ExpenseModel.deleteById.mockResolvedValue();

            const result = await ExpenseService.deleteExpense(1, 1);
            expect(result.message).toBe("Expense deleted successfully");
        });
    });

    describe("updateExpense", () => {
        test("success", async () => {
            ExpenseModel.findById.mockResolvedValue({ id: 1, user_id: 1, household_id: 1 });
            CategoryModel.findById.mockResolvedValue({ id: 2 });
            ExpenseModel.updateById.mockResolvedValue();

            const result = await ExpenseService.updateExpense(1, 1, {
                categoryId: 2, amount: 750000, expenseDate: "2026-04-10"
            });
            expect(result.amount).toBe(750000);
        });
    });
});

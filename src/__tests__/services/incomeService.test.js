jest.mock("../../models/incomeModel");
jest.mock("../../models/householdModel");
jest.mock("../../config/db", () => ({ execute: jest.fn() }));

const IncomeModel = require("../../models/incomeModel");
const HouseholdModel = require("../../models/householdModel");
const IncomeService = require("../../services/incomeService");

describe("IncomeService", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("createIncome", () => {
        test("success", async () => {
            HouseholdModel.findById.mockResolvedValue({ id: 1 });
            HouseholdModel.findMember.mockResolvedValue({ user_id: 1 });
            IncomeModel.create.mockResolvedValue({ id: 1, amount: 1000000 });

            const result = await IncomeService.createIncome(1, {
                householdId: 1, amount: 1000000, source: "Salary", incomeDate: "2026-04-01"
            });
            expect(result).toHaveProperty("id");
        });

        test("missing fields — throws 400", async () => {
            await expect(IncomeService.createIncome(1, { householdId: 1 }))
                .rejects.toEqual(expect.objectContaining({ status: 400 }));
        });

        test("not member — throws 403", async () => {
            HouseholdModel.findById.mockResolvedValue({ id: 1 });
            HouseholdModel.findMember.mockResolvedValue(null);

            await expect(IncomeService.createIncome(99, {
                householdId: 1, amount: 1000, source: "Test", incomeDate: "2026-04-01"
            })).rejects.toEqual(expect.objectContaining({ status: 403 }));
        });
    });

    describe("getIncomesByHousehold", () => {
        test("success", async () => {
            HouseholdModel.findById.mockResolvedValue({ id: 1 });
            HouseholdModel.findMember.mockResolvedValue({ user_id: 1 });
            IncomeModel.findByHouseholdId.mockResolvedValue([{ id: 1 }, { id: 2 }]);

            const result = await IncomeService.getIncomesByHousehold(1, 1);
            expect(result).toHaveLength(2);
        });
    });

    describe("deleteIncome", () => {
        test("success — own income", async () => {
            IncomeModel.findById.mockResolvedValue({ id: 1, user_id: 1, household_id: 1 });
            IncomeModel.deleteById.mockResolvedValue();

            const result = await IncomeService.deleteIncome(1, 1);
            expect(result.message).toBe("Income deleted successfully");
        });

        test("not authorized — throws 403", async () => {
            IncomeModel.findById.mockResolvedValue({ id: 1, user_id: 2, household_id: 1 });
            HouseholdModel.getMemberRole.mockResolvedValue("member");

            await expect(IncomeService.deleteIncome(3, 1))
                .rejects.toEqual(expect.objectContaining({ status: 403 }));
        });
    });

    describe("updateIncome", () => {
        test("success", async () => {
            IncomeModel.findById.mockResolvedValue({ id: 1, user_id: 1, household_id: 1 });
            IncomeModel.updateById.mockResolvedValue();

            const result = await IncomeService.updateIncome(1, 1, {
                amount: 2000000, source: "Bonus", incomeDate: "2026-04-15"
            });
            expect(result.amount).toBe(2000000);
        });
    });
});

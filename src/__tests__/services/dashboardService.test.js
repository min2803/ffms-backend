jest.mock("../../models/dashboardReportModel");
jest.mock("../../models/householdModel");
jest.mock("../../config/db", () => ({ execute: jest.fn() }));

const DashboardReportModel = require("../../models/dashboardReportModel");
const HouseholdModel = require("../../models/householdModel");
const DashboardService = require("../../services/dashboardService");

describe("DashboardService", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("getSummary", () => {
        const setupMocks = () => {
            HouseholdModel.findById.mockResolvedValue({ id: 1 });
            HouseholdModel.findMember.mockResolvedValue({ user_id: 1 });
            DashboardReportModel.getTotalIncome.mockResolvedValue(10000000);
            DashboardReportModel.getTotalExpense.mockResolvedValue(7000000);
            DashboardReportModel.getTrendByMonth.mockResolvedValue([]);
            DashboardReportModel.getIncomeDetailList.mockResolvedValue([]);
            DashboardReportModel.getExpenseDetailList.mockResolvedValue([]);
        };

        test("success — returns kpiCards with VND format", async () => {
            setupMocks();
            const result = await DashboardService.getSummary(1, 1, { month: 4, year: 2026 });

            expect(result.totalIncome).toBe(10000000);
            expect(result.totalExpense).toBe(7000000);
            expect(result.balance).toBe(3000000);
            expect(result.kpiCards).toHaveLength(3);
            expect(result.kpiCards[0].value).toContain("VND");
        });

        test("missing householdId — throws 400", async () => {
            await expect(DashboardService.getSummary(1, null, {}))
                .rejects.toEqual(expect.objectContaining({ status: 400 }));
        });

        test("not member — throws 403", async () => {
            HouseholdModel.findById.mockResolvedValue({ id: 1 });
            HouseholdModel.findMember.mockResolvedValue(null);

            await expect(DashboardService.getSummary(99, 1, { month: 4, year: 2026 }))
                .rejects.toEqual(expect.objectContaining({ status: 403 }));
        });

        test("aiInsights based on spending pattern", async () => {
            setupMocks();
            const result = await DashboardService.getSummary(1, 1, { month: 4, year: 2026 });

            expect(result.aiInsights).toHaveLength(2);
            expect(result.aiInsights[0].type).toBe("positive");
        });
    });
});

jest.mock("../../models/adminModel");
jest.mock("../../config/db", () => ({
    execute: jest.fn().mockResolvedValue([[]]),
}));

const AdminModel = require("../../models/adminModel");
const AdminService = require("../../services/adminService");

describe("AdminService", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("getSummary", () => {
        test("returns totals", async () => {
            AdminModel.countUsers.mockResolvedValue(50);
            AdminModel.countHouseholds.mockResolvedValue(20);
            AdminModel.countTransactions.mockResolvedValue(500);

            const result = await AdminService.getSummary();
            expect(result).toEqual({ totalUsers: 50, totalHouseholds: 20, totalTransactions: 500 });
        });
    });

    describe("deleteUser", () => {
        test("success", async () => {
            AdminModel.findUserById.mockResolvedValue({ id: 2 });
            AdminModel.deleteUser.mockResolvedValue();
            const db = require("../../config/db");
            db.execute.mockResolvedValue([[]]);

            const result = await AdminService.deleteUser(1, 2);
            expect(result.message).toBe("User deleted successfully");
        });

        test("self-delete — throws 400", async () => {
            await expect(AdminService.deleteUser(1, 1))
                .rejects.toEqual(expect.objectContaining({ status: 400 }));
        });
    });

    describe("updateUserRole", () => {
        test("success", async () => {
            AdminModel.findUserById.mockResolvedValue({ id: 2 });
            AdminModel.updateUserRole.mockResolvedValue();

            const result = await AdminService.updateUserRole(1, 2, 1);
            expect(result).toEqual({ id: 2, role_id: 1 });
        });

        test("invalid role — throws 400", async () => {
            await expect(AdminService.updateUserRole(1, 2, 5))
                .rejects.toEqual(expect.objectContaining({ status: 400 }));
        });
    });

    describe("getDashboard", () => {
        test("returns kpis array", async () => {
            AdminModel.countUsers.mockResolvedValue(10);
            AdminModel.countHouseholds.mockResolvedValue(5);
            AdminModel.countTransactions.mockResolvedValue(100);

            const result = await AdminService.getDashboard();
            expect(result).toHaveProperty("kpis");
            expect(result.kpis).toHaveLength(4);
            expect(result.kpis[0].label).toBe("Total Users");
        });
    });
});

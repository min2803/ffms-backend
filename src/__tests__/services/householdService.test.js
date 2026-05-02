jest.mock("../../models/householdModel");
jest.mock("../../models/userModel");
jest.mock("../../services/notificationService", () => ({
    create: jest.fn().mockResolvedValue(),
}));
jest.mock("../../config/db", () => ({
    execute: jest.fn(),
    getConnection: jest.fn().mockResolvedValue({
        beginTransaction: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
        execute: jest.fn().mockResolvedValue([[]]),
    }),
}));

const HouseholdModel = require("../../models/householdModel");
const UserModel = require("../../models/userModel");
const HouseholdService = require("../../services/householdService");

describe("HouseholdService", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("createHousehold", () => {
        test("success — creates household and adds owner", async () => {
            HouseholdModel.create.mockResolvedValue({ id: 1, name: "Test House" });
            HouseholdModel.addMember.mockResolvedValue({ id: 1 });

            const result = await HouseholdService.createHousehold(1, { name: "Test House" });
            expect(result.name).toBe("Test House");
            expect(HouseholdModel.addMember).toHaveBeenCalledWith(1, 1, "owner");
        });

        test("empty name — throws 400", async () => {
            await expect(HouseholdService.createHousehold(1, { name: "" }))
                .rejects.toEqual(expect.objectContaining({ status: 400 }));
        });
    });

    describe("addMember", () => {
        test("success", async () => {
            HouseholdModel.findById.mockResolvedValue({ id: 1, name: "House" });
            HouseholdModel.getMemberRole.mockResolvedValue("owner");
            UserModel.findById.mockResolvedValue({ id: 2, name: "New User" });
            HouseholdModel.findMember.mockResolvedValue(null);
            HouseholdModel.addMember.mockResolvedValue({ id: 1 });

            const result = await HouseholdService.addMember(1, 1, 2);
            expect(result).toHaveProperty("id");
        });

        test("requester not owner/admin — throws 403", async () => {
            HouseholdModel.findById.mockResolvedValue({ id: 1 });
            HouseholdModel.getMemberRole.mockResolvedValue("member");

            await expect(HouseholdService.addMember(3, 1, 2))
                .rejects.toEqual(expect.objectContaining({ status: 403 }));
        });

        test("already member — throws 409", async () => {
            HouseholdModel.findById.mockResolvedValue({ id: 1, name: "House" });
            HouseholdModel.getMemberRole.mockResolvedValue("owner");
            UserModel.findById.mockResolvedValue({ id: 2 });
            HouseholdModel.findMember.mockResolvedValue({ id: 1, role: "member" });

            await expect(HouseholdService.addMember(1, 1, 2))
                .rejects.toEqual(expect.objectContaining({ status: 409 }));
        });
    });

    describe("removeMember", () => {
        test("success", async () => {
            HouseholdModel.findById.mockResolvedValue({ id: 1 });
            HouseholdModel.getMemberRole.mockResolvedValue("owner");
            HouseholdModel.findMember.mockResolvedValue({ role: "member" });
            HouseholdModel.removeMember.mockResolvedValue();

            await expect(HouseholdService.removeMember(1, 1, 2)).resolves.toBeUndefined();
        });

        test("cannot remove owner — throws 400", async () => {
            HouseholdModel.findById.mockResolvedValue({ id: 1 });
            HouseholdModel.getMemberRole.mockResolvedValue("owner");
            HouseholdModel.findMember.mockResolvedValue({ role: "owner" });

            await expect(HouseholdService.removeMember(1, 1, 2))
                .rejects.toEqual(expect.objectContaining({ status: 400 }));
        });
    });
});

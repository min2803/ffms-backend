const bcrypt = require("bcryptjs");

jest.mock("../../models/userModel");
jest.mock("../../config/db", () => ({ execute: jest.fn() }));

const UserModel = require("../../models/userModel");
const UsersService = require("../../services/usersService");

const mockUser = {
    id: 1,
    name: "Test",
    email: "test@example.com",
    password_hash: "$2a$10$hash",
    role_name: "user",
    role_id: 2,
};

describe("UsersService", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("getProfile", () => {
        test("success — returns user without password", async () => {
            UserModel.findById.mockResolvedValue(mockUser);
            const result = await UsersService.getProfile(1);
            expect(result).not.toHaveProperty("password_hash");
            expect(result.name).toBe("Test");
        });

        test("user not found — throws 404", async () => {
            UserModel.findById.mockResolvedValue(null);
            await expect(UsersService.getProfile(999))
                .rejects.toEqual(expect.objectContaining({ status: 404 }));
        });
    });

    describe("updateProfile", () => {
        test("success — returns updated user", async () => {
            UserModel.findById.mockResolvedValue(mockUser);
            UserModel.updateById.mockResolvedValue({ ...mockUser, name: "Updated" });
            const result = await UsersService.updateProfile(1, { name: "Updated" });
            expect(result.name).toBe("Updated");
        });

        test("no fields — throws 400", async () => {
            await expect(UsersService.updateProfile(1, {}))
                .rejects.toEqual(expect.objectContaining({ status: 400 }));
        });

        test("duplicate email — throws 409", async () => {
            UserModel.findById.mockResolvedValue(mockUser);
            UserModel.findByEmail.mockResolvedValue({ id: 2, email: "taken@example.com" });
            await expect(UsersService.updateProfile(1, { email: "taken@example.com" }))
                .rejects.toEqual(expect.objectContaining({ status: 409 }));
        });
    });

    describe("changePassword", () => {
        test("success", async () => {
            UserModel.findById.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
            jest.spyOn(bcrypt, "hash").mockResolvedValue("newhash");
            UserModel.updateById.mockResolvedValue(mockUser);

            await expect(UsersService.changePassword(1, { currentPassword: "old", newPassword: "newpass123" }))
                .resolves.toBeUndefined();
        });

        test("wrong current password — throws 401", async () => {
            UserModel.findById.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

            await expect(UsersService.changePassword(1, { currentPassword: "wrong", newPassword: "newpass123" }))
                .rejects.toEqual(expect.objectContaining({ status: 401 }));
        });
    });

    describe("searchUsers", () => {
        test("keyword < 2 chars — throws 400", async () => {
            await expect(UsersService.searchUsers("a"))
                .rejects.toEqual(expect.objectContaining({ status: 400 }));
        });
    });
});

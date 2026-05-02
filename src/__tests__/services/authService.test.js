const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../models/userModel");
jest.mock("../../models/tokenBlacklistModel");
jest.mock("../../models/refreshTokenModel");
jest.mock("../../config/db", () => ({
    execute: jest.fn(),
    getConnection: jest.fn().mockResolvedValue({
        beginTransaction: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
        execute: jest.fn(),
    }),
}));
jest.mock("../../services/householdService", () => ({
    ensureUserHasHousehold: jest.fn().mockResolvedValue({ id: 10 }),
}));

const UserModel = require("../../models/userModel");
const RefreshTokenModel = require("../../models/refreshTokenModel");
const AuthService = require("../../services/authService");

const mockUser = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    password_hash: "$2a$10$hashedpassword",
    role_name: "user",
    household_id: 10,
};

describe("AuthService", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("register", () => {
        test("success — returns user without password", async () => {
            UserModel.findByEmail.mockResolvedValue(null);
            UserModel.create.mockResolvedValue({ id: 1, name: "Test", email: "test@example.com", role_name: "user" });

            const result = await AuthService.register({ name: "Test", email: "test@example.com", password: "password123" });
            expect(result).toHaveProperty("id");
            expect(result).not.toHaveProperty("password_hash");
        });

        test("missing fields — throws 400", async () => {
            await expect(AuthService.register({ name: "", email: "", password: "" }))
                .rejects.toEqual(expect.objectContaining({ status: 400 }));
        });

        test("invalid email — throws 400", async () => {
            await expect(AuthService.register({ name: "Test", email: "invalid", password: "password123" }))
                .rejects.toEqual(expect.objectContaining({ status: 400, message: "Invalid email format" }));
        });

        test("password < 8 chars — throws 400", async () => {
            await expect(AuthService.register({ name: "Test", email: "test@example.com", password: "short" }))
                .rejects.toEqual(expect.objectContaining({ status: 400 }));
        });

        test("duplicate email — throws 409", async () => {
            UserModel.findByEmail.mockResolvedValue(mockUser);
            await expect(AuthService.register({ name: "Test", email: "test@example.com", password: "password123" }))
                .rejects.toEqual(expect.objectContaining({ status: 409 }));
        });
    });

    describe("login", () => {
        test("success — returns user + tokens", async () => {
            UserModel.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
            RefreshTokenModel.create.mockResolvedValue();

            const result = await AuthService.login({ email: "test@example.com", password: "password123" });
            expect(result).toHaveProperty("accessToken");
            expect(result).toHaveProperty("refreshToken");
            expect(result.user).not.toHaveProperty("password_hash");
        });

        test("wrong password — throws 401", async () => {
            UserModel.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

            await expect(AuthService.login({ email: "test@example.com", password: "wrong" }))
                .rejects.toEqual(expect.objectContaining({ status: 401 }));
        });

        test("non-existent email — throws 401", async () => {
            UserModel.findByEmail.mockResolvedValue(null);

            await expect(AuthService.login({ email: "none@example.com", password: "password123" }))
                .rejects.toEqual(expect.objectContaining({ status: 401 }));
        });
    });

    describe("forgotPassword", () => {
        test("success — returns resetToken for existing user", async () => {
            UserModel.findByEmail.mockResolvedValue(mockUser);
            const result = await AuthService.forgotPassword("test@example.com");
            expect(result).toHaveProperty("resetToken");
            expect(result.message).toContain("reset token");
        });
    });

    describe("resetPassword", () => {
        test("success — updates password and clears refresh tokens", async () => {
            const resetSecret = process.env.JWT_RESET_SECRET || (process.env.JWT_SECRET + "-reset");
            const resetToken = jwt.sign(
                { userId: 1, email: "test@example.com", purpose: "password-reset" },
                resetSecret,
                { expiresIn: "15m" }
            );
            UserModel.findById.mockResolvedValue(mockUser);
            UserModel.updateById.mockResolvedValue(mockUser);
            RefreshTokenModel.deleteByUserId.mockResolvedValue();

            const result = await AuthService.resetPassword(resetToken, "newpassword123");
            expect(result.message).toBe("Password reset successfully");
            expect(RefreshTokenModel.deleteByUserId).toHaveBeenCalledWith(1);
        });
    });
});

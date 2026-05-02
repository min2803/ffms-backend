jest.mock("../../services/authService");

const AuthService = require("../../services/authService");
const AuthController = require("../../controllers/authController");

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("AuthController", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("register", () => {
        test("201 on success", async () => {
            const req = { body: { name: "Test", email: "test@example.com", password: "password123" } };
            const res = mockRes();
            AuthService.register.mockResolvedValue({ id: 1, name: "Test", email: "test@example.com" });

            await AuthController.register(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        test("400 on validation error", async () => {
            const req = { body: { name: "", email: "", password: "" } };
            const res = mockRes();
            AuthService.register.mockRejectedValue({ status: 400, message: "Name, email, and password are required" });

            await AuthController.register(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe("login", () => {
        test("200 on success", async () => {
            const req = { body: { email: "test@example.com", password: "password123" } };
            const res = mockRes();
            AuthService.login.mockResolvedValue({
                user: { id: 1 },
                accessToken: "access",
                refreshToken: "refresh"
            });

            await AuthController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        test("401 on wrong credentials", async () => {
            const req = { body: { email: "test@example.com", password: "wrong" } };
            const res = mockRes();
            AuthService.login.mockRejectedValue({ status: 401, message: "Invalid email or password" });

            await AuthController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
        });
    });

    describe("forgotPassword", () => {
        test("200 on success", async () => {
            const req = { body: { email: "test@example.com" } };
            const res = mockRes();
            AuthService.forgotPassword.mockResolvedValue({ message: "Token generated", resetToken: "token123" });

            await AuthController.forgotPassword(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("resetPassword", () => {
        test("200 on success", async () => {
            const req = { body: { token: "resettoken", newPassword: "newpass123" } };
            const res = mockRes();
            AuthService.resetPassword.mockResolvedValue({ message: "Password reset successfully" });

            await AuthController.resetPassword(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});

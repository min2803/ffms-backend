const AuthService = require("../services/authService");
const { handleRequest } = require("../utils/controllerHandler");

const AuthController = {
    register: handleRequest(async (req, res) => {
        const { name, email, password } = req.body;
        const user = await AuthService.register({ name, email, password });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    }, "Register"),

    login: handleRequest(async (req, res) => {
        const { email, password } = req.body;
        const result = await AuthService.login({ email, password });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    }, "Login"),

    logout: handleRequest(async (req, res) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({ success: false, message: "Authorization header missing or malformed" });
        }
        const accessToken = authHeader.split(" ")[1];
        const { refreshToken } = req.body;

        await AuthService.logout(accessToken, refreshToken);

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    }, "Logout"),

    forgotPassword: handleRequest(async (req, res) => {
        const { email } = req.body;
        const result = await AuthService.forgotPassword(email);
        return res.status(200).json({ success: true, ...result });
    }, "Forgot password"),

    resetPassword: handleRequest(async (req, res) => {
        const { token, newPassword } = req.body;
        const result = await AuthService.resetPassword(token, newPassword);
        return res.status(200).json({ success: true, ...result });
    }, "Reset password"),

    refresh: handleRequest(async (req, res) => {
        const { refreshToken } = req.body;
        const tokens = await AuthService.refresh(refreshToken);

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: tokens
        });
    }, "Refresh token")
};

module.exports = AuthController;

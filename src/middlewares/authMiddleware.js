const jwt = require("jsonwebtoken");
const TokenBlacklistModel = require("../models/tokenBlacklistModel");

/**
 * Middleware xác thực JWT từ header Authorization: Bearer <token>
 * Kiểm tra token có nằm trong danh sách đen không
 * Gắn payload đã giải mã vào req.user
 */
const verifyToken = async (req, res, next) => {
    try {
        // Lấy header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided"
            });
        }

        // Tách token từ header
        const token = authHeader.split(" ")[1];

        // Kiểm tra token có trong danh sách đen không
        const isBlacklisted = await TokenBlacklistModel.isBlacklisted(token);
        if (isBlacklisted) {
            return res.status(401).json({
                success: false,
                message: "Token has been revoked"
            });
        }

        // Xác minh và giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Gắn thông tin user vào request
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = { verifyToken };

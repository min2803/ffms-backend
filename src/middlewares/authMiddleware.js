const jwt = require("jsonwebtoken");
const TokenBlacklistModel = require("../models/tokenBlacklistModel");

/**
 * Middleware xác thực JWT từ header Authorization: Bearer <token>
 * Kiểm tra token có nằm trong danh sách đen không
 * Trả về mã lỗi chi tiết để Frontend dễ xử lý
 */
const verifyToken = async (req, res, next) => {
    try {
        // 1. Lấy header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                code: "NO_TOKEN",
                message: "Access denied. No token provided"
            });
        }

        // 2. Kiểm tra định dạng Bearer <token>
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                code: "INVALID_FORMAT",
                message: "Token must use Bearer format: 'Bearer <token>'"
            });
        }

        // 3. Tách token từ header
        const token = authHeader.split(" ")[1];

        if (!token || token === "null" || token === "undefined") {
            return res.status(401).json({
                success: false,
                code: "NO_TOKEN",
                message: "Access denied. Token is empty or invalid"
            });
        }

        // 4. Kiểm tra token có trong danh sách đen không
        const isBlacklisted = await TokenBlacklistModel.isBlacklisted(token);
        if (isBlacklisted) {
            return res.status(401).json({
                success: false,
                code: "TOKEN_REVOKED",
                message: "Token has been revoked. Please login again"
            });
        }

        // 5. Xác minh và giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 6. Gắn thông tin user vào request
        req.user = decoded;
        
        // Nếu token không có householdId, thử lấy từ DB (cho user mới bootstrap hoặc migration)
        if (!decoded.householdId) {
            const db = require("../config/db");
            const [rows] = await db.execute("SELECT household_id FROM users WHERE id = ?", [decoded.userId]);
            req.householdId = (rows.length > 0) ? rows[0].household_id : null;
        } else {
            req.householdId = decoded.householdId;
        }

        next();
    } catch (error) {
        // Xử lý các lỗi JWT cụ thể
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                code: "TOKEN_EXPIRED",
                message: "Token has expired. Please refresh or login again"
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                code: "TOKEN_INVALID",
                message: "Token is invalid. Please login again"
            });
        }

        if (error.name === "NotBeforeError") {
            return res.status(401).json({
                success: false,
                code: "TOKEN_NOT_ACTIVE",
                message: "Token is not yet active"
            });
        }

        // Lỗi không xác định
        console.error("Auth middleware error:", error.name, error.message);
        return res.status(401).json({
            success: false,
            code: "AUTH_ERROR",
            message: "Authentication failed"
        });
    }
};

/**
 * Middleware phân quyền theo role (RBAC)
 * Sử dụng sau verifyToken
 * @param  {...string} roles - Danh sách role được phép truy cập
 */
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                success: false,
                code: "NO_ROLE",
                message: "Access denied. No role found"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                code: "INSUFFICIENT_PERMISSIONS",
                message: "Access denied. Insufficient permissions"
            });
        }

        next();
    };
};

module.exports = { verifyToken, authorizeRole };

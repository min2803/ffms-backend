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
        
        // Luôn lấy active household_id từ DB để đảm bảo đồng bộ khi user chuyển household
        const db = require("../config/db");
        const [rows] = await db.execute("SELECT household_id FROM users WHERE id = ?", [decoded.userId]);
        let householdId = (rows.length > 0) ? rows[0].household_id : null;

        // Fallback: Nếu users.household_id là null (user được add vào household nhưng chưa update),
        // tìm household đầu tiên từ household_members và tự động sync lại users.household_id
        if (!householdId) {
            const [memberRows] = await db.execute(
                `SELECT hm.household_id FROM household_members hm
                 JOIN households h ON hm.household_id = h.id
                 WHERE hm.user_id = ? AND (h.is_deleted = false OR h.is_deleted IS NULL)
                 ORDER BY hm.joined_at DESC LIMIT 1`,
                [decoded.userId]
            );
            if (memberRows.length > 0) {
                householdId = memberRows[0].household_id;
                // Sync lại users.household_id để lần sau không phải fallback nữa
                await db.execute("UPDATE users SET household_id = ? WHERE id = ?", [householdId, decoded.userId]);
            }
        }

        req.householdId = householdId;

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

const requireHousehold = (req, res, next) => {
    if (!req.householdId) {
        return res.status(400).json({
            success: false,
            code: "NO_HOUSEHOLD",
            message: "No household associated with your account. Please log out and log in again."
        });
    }
    next();
};

module.exports = { verifyToken, authorizeRole, requireHousehold };

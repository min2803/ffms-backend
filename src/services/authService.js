const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const TokenBlacklistModel = require("../models/tokenBlacklistModel");
const RefreshTokenModel = require("../models/refreshTokenModel");

const SALT_ROUNDS = 10;

/**
 * Tạo access token (ngắn hạn)
 */
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role_name, householdId: user.household_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );
};

/**
 * Tạo refresh token (dài hạn)
 */
const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role_name, householdId: user.household_id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );
};

const AuthService = {
    /**
     * Đăng ký tài khoản mới
     */
    async register({ name, email, password }) {
        // Kiểm tra các trường bắt buộc
        if (!name || !email || !password) {
            throw { status: 400, message: "Name, email, and password are required" };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw { status: 400, message: "Invalid email format" };
        }

        // Validate password length
        if (password.length < 6) {
            throw { status: 400, message: "Password must be at least 6 characters" };
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw { status: 409, message: "Email already exists" };
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const db = require("../config/db");
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Tạo user mới trong cơ sở dữ liệu
            const user = await UserModel.create({
                name,
                email,
                password: hashedPassword
            }, connection);

            // Tạo Personal Household cho user
            const HouseholdModel = require("../models/householdModel");
            const household = await HouseholdModel.create({
                name: `${name}'s Personal Finance`,
                description: "Default personal household",
                ownerId: user.id
            }, connection);
            await HouseholdModel.addMember(household.id, user.id, "owner", connection);

            // Cập nhật household_id cho user
            await connection.execute("UPDATE users SET household_id = ? WHERE id = ?", [household.id, user.id]);

            await connection.commit();
            user.household_id = household.id;
            return user;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    /**
     * Đăng nhập — trả về accessToken và refreshToken
     */
    async login({ email, password }) {
        // Kiểm tra các trường bắt buộc
        if (!email || !password) {
            throw { status: 400, message: "Email and password are required" };
        }

        // Tìm user theo email
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw { status: 401, message: "Invalid email or password" };
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw { status: 401, message: "Invalid email or password" };
        }

        // Tự động Bootstrap dữ liệu nếu user chưa có household (fix lỗi giao diện trống)
        const HouseholdService = require("./householdService");
        const household = await HouseholdService.ensureUserHasData(user.id);
        
        // Cập nhật lại thông tin household mới nhất vào user object trước khi tạo token
        user.household_id = household.id;

        // Tạo access token và refresh token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Lưu refresh token vào database
        const decoded = jwt.decode(refreshToken);
        const expiresAt = new Date(decoded.exp * 1000);
        await RefreshTokenModel.create(user.id, refreshToken, expiresAt);

        // Trả về thông tin user (không kèm password) và tokens
        const { password_hash, ...userWithoutPassword } = user;

        // Định tuyến household mặc định từ cột db
        userWithoutPassword.currentHouseholdId = user.household_id;

        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken
        };
    },

    /**
     * Đăng xuất — vô hiệu hóa access token và xóa refresh token
     */
    async logout(accessToken, refreshToken) {
        // Vô hiệu hóa access token
        const decoded = jwt.decode(accessToken);
        if (decoded && decoded.exp) {
            const expiresAt = new Date(decoded.exp * 1000);
            await TokenBlacklistModel.add(accessToken, expiresAt);
        }

        // Xóa refresh token nếu có
        if (refreshToken) {
            await RefreshTokenModel.deleteByToken(refreshToken);
        }
    },

    /**
     * Refresh — tạo access token mới từ refresh token
     */
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw { status: 400, message: "Refresh token is required" };
        }

        // Kiểm tra refresh token có tồn tại trong database
        const storedToken = await RefreshTokenModel.findByToken(refreshToken);
        if (!storedToken) {
            throw { status: 401, message: "Invalid or expired refresh token" };
        }

        // Xác minh refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            // Token hết hạn hoặc không hợp lệ → xóa khỏi database
            await RefreshTokenModel.deleteByToken(refreshToken);
            throw { status: 401, message: "Invalid or expired refresh token" };
        }

        // Tìm user để đảm bảo vẫn tồn tại
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            await RefreshTokenModel.deleteByToken(refreshToken);
            throw { status: 401, message: "User not found" };
        }

        // Xóa refresh token cũ (rotation)
        await RefreshTokenModel.deleteByToken(refreshToken);

        // Tạo cặp token mới
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Lưu refresh token mới vào database
        const newDecoded = jwt.decode(newRefreshToken);
        const expiresAt = new Date(newDecoded.exp * 1000);
        await RefreshTokenModel.create(user.id, newRefreshToken, expiresAt);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }
};

module.exports = AuthService;

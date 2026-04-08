-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS ffms;
USE ffms;

-- Bảng người dùng
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng danh sách đen token (dùng cho chức năng đăng xuất)
CREATE TABLE IF NOT EXISTS token_blacklist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(512) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_token (token)
);

-- Bảng refresh token
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(512) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_token (token),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Migration: thêm cột role nếu chưa có
-- ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER password_hash;

-- =====================================================
-- Migration: Household soft delete
-- Thêm cột is_deleted vào bảng households để hỗ trợ soft delete
-- Chạy lệnh sau trong MySQL:
-- ALTER TABLE households ADD COLUMN is_deleted BOOLEAN DEFAULT false;
-- =====================================================

-- =====================================================
-- Lưu ý: Bảng household_members cần có ON DELETE CASCADE
-- để khi xóa household, các member sẽ tự động bị xóa
-- FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE
-- =====================================================
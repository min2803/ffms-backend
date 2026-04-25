-- 1. Tạo bảng utility_readings nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS utility_readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    value DECIMAL(15, 2) NOT NULL,
    cost DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Đảm bảo bảng households và household_members tồn tại (nếu chưa có từ các migration trước)
CREATE TABLE IF NOT EXISTS households (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id INT NOT NULL,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS household_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    household_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('owner', 'admin', 'member') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_membership (household_id, user_id),
    FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Migration cho USER CŨ: Tạo Household cho những user chưa có
INSERT INTO households (name, description, owner_id)
SELECT CONCAT(name, '''s Personal Finance'), 'Default financial workspace created by migration', id
FROM users
WHERE id NOT IN (SELECT user_id FROM household_members);

-- 4. Thêm bản ghi vào household_members cho các household vừa tạo
INSERT INTO household_members (household_id, user_id, role)
SELECT h.id, u.id, 'owner'
FROM users u
JOIN households h ON u.id = h.owner_id
WHERE NOT EXISTS (
    SELECT 1 FROM household_members hm 
    WHERE hm.user_id = u.id AND hm.household_id = h.id
);

-- 5. Cập nhật field household_id cho bảng users (nếu có cột này)
-- Chú ý: Một số phiên bản dùng cột này để truy cập nhanh
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'household_id' AND TABLE_SCHEMA = DATABASE());
SET @sql = IF(@column_exists > 0, 'UPDATE users u JOIN households h ON u.id = h.owner_id SET u.household_id = h.id WHERE u.household_id IS NULL', 'SELECT "Column household_id does not exist, skipping update"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Script fix các User chưa có Household
-- Mục tiêu: Quét bảng users, nếu ai chưa có household_id thì tạo cho họ 1 cái và gán làm owner.

-- 1. Tạo Household cho những user chưa có
INSERT INTO households (name, description, owner_id)
SELECT CONCAT(name, '''s Personal Finance'), 'Default financial workspace created by migration', id
FROM users
WHERE household_id IS NULL OR id NOT IN (SELECT user_id FROM household_members);

-- 2. Cập nhật field household_id cho bảng users từ households vừa tạo
-- Dùng JOIN để mapping ngược lại
UPDATE users u
JOIN households h ON u.id = h.owner_id
SET u.household_id = h.id
WHERE u.household_id IS NULL;

-- 3. Thêm bản ghi vào household_members
INSERT INTO household_members (household_id, user_id, role)
SELECT h.id, u.id, 'owner'
FROM users u
JOIN households h ON u.id = h.owner_id
WHERE NOT EXISTS (
    SELECT 1 FROM household_members hm 
    WHERE hm.user_id = u.id AND hm.household_id = h.id
);

-- 4. Tạo Categories cơ bản cho các Household mới
-- Lấy danh sách households vừa được "cứu" ở bước trên
INSERT INTO categories (household_id, name, type)
SELECT h.id, default_cat.name, default_cat.type
FROM households h
CROSS JOIN (
    SELECT 'Ăn uống' as name, 'expense' as type UNION ALL
    SELECT 'Di chuyển', 'expense' UNION ALL
    SELECT 'Nhà ở', 'expense' UNION ALL
    SELECT 'Mua sắm', 'expense' UNION ALL
    SELECT 'Giải trí', 'expense' UNION ALL
    SELECT 'Sức khỏe', 'expense' UNION ALL
    SELECT 'Tiền lương', 'income' UNION ALL
    SELECT 'Thưởng', 'income'
) default_cat
INNER JOIN users u ON h.owner_id = u.id
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.household_id = h.id);

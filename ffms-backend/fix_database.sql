-- 1. Bổ sung cột household_id vào users table
ALTER TABLE users ADD COLUMN household_id INT DEFAULT NULL;

-- 2. Đặt DELIMITER để viết script vòng lặp fix orphan users
DELIMITER $$

CREATE PROCEDURE FixOrphanUsers()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE u_id INT;
    DECLARE u_name VARCHAR(255);
    DECLARE new_h_id INT;

    -- Tìm các user CHƯA CÓ household_id
    DECLARE cur CURSOR FOR SELECT id, name FROM users WHERE household_id IS NULL;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    START TRANSACTION;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO u_id, u_name;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Kiểm tra xem user này đã là owner của household nào trong member table chưa?
        SELECT MAX(household_id) INTO new_h_id FROM household_members WHERE user_id = u_id AND role = 'owner';

        -- Nếu chưa tạo household nào, tạo 1 household mới cứng
        IF new_h_id IS NULL THEN
            INSERT INTO households (name, description, owner_id, created_at)
            VALUES (CONCAT(u_name, '''s Personal Finance'), 'Default personal household', u_id, NOW());
            
            SET new_h_id = LAST_INSERT_ID();
            
            -- Insert luôn vào household_members
            INSERT INTO household_members (household_id, user_id, role, joined_at)
            VALUES (new_h_id, u_id, 'owner', NOW());
        END IF;

        -- Update users table gán household_id active
        UPDATE users SET household_id = new_h_id WHERE id = u_id;
    END LOOP;

    CLOSE cur;

    COMMIT;
END$$

DELIMITER ;

-- 3. Gọi Stored Procedure
CALL FixOrphanUsers();

-- 4. Xóa Stored Procedure rác
DROP PROCEDURE FixOrphanUsers;

-- 5. Add ràng buộc Khóa Ngoại (Foreign Key)
ALTER TABLE users ADD CONSTRAINT fk_user_primary_household FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE SET NULL;

require('dotenv').config();
const db = require('./src/config/db');

async function seedAll() {
    try {
        console.log("Bắt đầu nạp dữ liệu mẫu cho toàn bộ hệ thống...");

        // 1. Lấy tất cả household và owner
        const [households] = await db.execute("SELECT id, name FROM households WHERE is_deleted = 0");
        
        for (const hh of households) {
            console.log(`Đang nạp dữ liệu cho Household: ${hh.name} (ID: ${hh.id})`);
            
            // Lấy danh sách thành viên
            const [members] = await db.execute("SELECT user_id FROM household_members WHERE household_id = ?", [hh.id]);
            if (members.length === 0) continue;

            // Lấy categories
            const [categories] = await db.execute("SELECT id, type FROM categories WHERE household_id = ?", [hh.id]);
            const expCats = categories.filter(c => c.type === 'expense').map(c => c.id);
            const incCats = categories.filter(c => c.type === 'income').map(c => c.id);

            if (expCats.length === 0 || incCats.length === 0) {
                console.log(`Household ${hh.id} thiếu danh mục, đang tạo danh mục mặc định...`);
                // Tạo nhanh danh mục nếu thiếu
                const defaultCats = [
                    ['Ăn uống', 'expense'], ['Di chuyển', 'expense'], ['Nhà ở', 'expense'],
                    ['Tiền lương', 'income'], ['Thưởng', 'income']
                ];
                for (const [name, type] of defaultCats) {
                    const [res] = await db.execute("INSERT INTO categories (household_id, name, type) VALUES (?, ?, ?)", [hh.id, name, type]);
                    if (type === 'expense') expCats.push(res.insertId);
                    else incCats.push(res.insertId);
                }
            }

            const now = new Date();
            for (let i = 0; i < 90; i++) {
                const date = new Date();
                date.setDate(now.getDate() - i);
                const dateString = date.toISOString().split('T')[0];
                const userId = members[Math.floor(Math.random() * members.length)].user_id;

                // Incomes
                if (date.getDate() === 1 || date.getDate() === 15) {
                    await db.execute(
                        "INSERT INTO incomes (household_id, user_id, amount, source, income_date) VALUES (?, ?, ?, ?, ?)",
                        [hh.id, userId, 15000000, "Lương mẫu", dateString]
                    );
                }

                // Expenses
                if (Math.random() > 0.4) {
                    const catId = expCats[Math.floor(Math.random() * expCats.length)];
                    await db.execute(
                        "INSERT INTO expenses (household_id, user_id, category_id, amount, description, expense_date) VALUES (?, ?, ?, ?, ?, ?)",
                        [hh.id, userId, catId, Math.random() * 500000 + 50000, "Chi tiêu mẫu", dateString]
                    );
                }

                // Utility readings
                if (date.getDate() === 28) {
                    await db.execute(
                        "INSERT INTO utility_readings (user_id, type, value, cost, date) VALUES (?, ?, ?, ?, ?)",
                        [userId, 'electricity', Math.random() * 200 + 100, Math.random() * 400000 + 100000, dateString]
                    );
                }
            }
            console.log(`Xong Household ${hh.name}`);
        }

        console.log("Hoàn tất nạp dữ liệu mẫu cho tất cả User!");
        process.exit(0);
    } catch (err) {
        console.error("Lỗi Seeding:", err);
        process.exit(1);
    }
}

seedAll();

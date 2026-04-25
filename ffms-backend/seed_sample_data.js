require('dotenv').config();
const db = require('./src/config/db');
const IncomeModel = require('./src/models/incomeModel');
const ExpenseModel = require('./src/models/expenseModel');
const CategoryModel = require('./src/models/categoryModel');
const HouseholdModel = require('./src/models/householdModel');

async function seed() {
    try {
        console.log("Bắt đầu khởi tạo dữ liệu mẫu...");

        // 1. Lấy danh sách tất cả user
        const [users] = await db.execute("SELECT id, name, household_id FROM users");
        
        for (const user of users) {
            console.log(`Đang xử lý dữ liệu cho user: ${user.name} (ID: ${user.id})`);
            
            let householdId = user.household_id;
            
            // Nếu user chưa có household_id trong bảng users, tìm trong household_members
            if (!householdId) {
                const [memberships] = await db.execute("SELECT household_id FROM household_members WHERE user_id = ? LIMIT 1", [user.id]);
                if (memberships.length > 0) {
                    householdId = memberships[0].household_id;
                    await db.execute("UPDATE users SET household_id = ? WHERE id = ?", [householdId, user.id]);
                } else {
                    console.log(`User ${user.name} chưa có household, bỏ qua seeding.`);
                    continue;
                }
            }

            // 2. Lấy danh sách Categories của household
            const categories = await CategoryModel.findAllByHousehold(householdId);
            const expenseCategories = categories.filter(c => c.type === 'expense');
            const incomeCategories = categories.filter(c => c.type === 'income');

            if (expenseCategories.length === 0 || incomeCategories.length === 0) {
                console.log(`Household ${householdId} thiếu categories, bỏ qua seeding.`);
                continue;
            }

            // 3. Tạo dữ liệu mẫu cho 3 tháng gần nhất
            const now = new Date();
            for (let i = 0; i < 90; i++) {
                const date = new Date();
                date.setDate(now.getDate() - i);
                const dateString = date.toISOString().split('T')[0];

                // A. Tạo chi tiêu (Ngẫu nhiên 0-3 giao dịch mỗi ngày)
                const numExpenses = Math.floor(Math.random() * 3);
                for (let j = 0; j < numExpenses; j++) {
                    const cat = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
                    const amount = Math.floor(Math.random() * 500000) + 10000; // 10k - 510k
                    await ExpenseModel.create({
                        householdId,
                        userId: user.id,
                        categoryId: cat.id,
                        amount,
                        description: `Chi tiêu mẫu cho ${cat.name}`,
                        expenseDate: dateString
                    });
                }

                // B. Tạo thu nhập (Mỗi tháng 2 lần vào ngày 1 và 15)
                const day = date.getDate();
                if (day === 1 || day === 15) {
                    const amount = Math.floor(Math.random() * 5000000) + 10000000; // 10tr - 15tr
                    await IncomeModel.create({
                        householdId,
                        userId: user.id,
                        amount,
                        source: "Lương tháng mẫu",
                        description: "Dữ liệu mẫu khởi tạo bởi hệ thống",
                        incomeDate: dateString
                    });
                }

                // C. Tạo chỉ số điện nước (Mỗi tháng 1 lần vào ngày 28)
                if (day === 28) {
                    // Điện
                    await db.execute(
                        "INSERT INTO utility_readings (user_id, type, value, cost, date) VALUES (?, ?, ?, ?, ?)",
                        [user.id, 'electricity', Math.random() * 300 + 100, Math.random() * 500000 + 200000, dateString]
                    );
                    // Nước
                    await db.execute(
                        "INSERT INTO utility_readings (user_id, type, value, cost, date) VALUES (?, ?, ?, ?, ?)",
                        [user.id, 'water', Math.random() * 20 + 5, Math.random() * 100000 + 50000, dateString]
                    );
                }
            }
            console.log(`Xong dữ liệu mẫu cho user ${user.name}.`);
        }

        console.log("Hoàn tất khởi tạo dữ liệu mẫu cho tất cả người dùng!");
        process.exit(0);

    } catch (error) {
        console.error("Lỗi khi seeding dữ liệu:", error);
        process.exit(1);
    }
}

seed();

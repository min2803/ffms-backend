require('dotenv').config();
const db = require('./src/config/db');

async function test() {
    try {
        const [incomes] = await db.execute("SELECT COUNT(*) as count FROM incomes");
        const [expenses] = await db.execute("SELECT COUNT(*) as count FROM expenses");
        const [households] = await db.execute("SELECT COUNT(*) as count FROM households");
        const [readings] = await db.execute("SELECT COUNT(*) as count FROM utility_readings");
        
        console.log("KẾT QUẢ KIỂM TRA DATABASE:");
        console.log("- Tổng số Household:", households[0].count);
        console.log("- Tổng số Income:", incomes[0].count);
        console.log("- Tổng số Expense:", expenses[0].count);
        console.log("- Tổng số Utility Readings:", readings[0].count);
        
        process.exit(0);
    } catch (err) {
        console.error("Lỗi kiểm tra:", err);
        process.exit(1);
    }
}

test();

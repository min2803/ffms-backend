require('dotenv').config();
const DashboardService = require('./src/services/dashboardService');

async function test() {
    try {
        console.log("Đang kiểm tra Dashboard API Response...");
        
        // Giả lập userId 1 và householdId 1 (hoặc lấy từ DB)
        const db = require('./src/config/db');
        const [users] = await db.execute("SELECT id, household_id FROM users LIMIT 1");
        if (users.length === 0) {
            console.log("No users found");
            process.exit(1);
        }
        
        const userId = users[0].id;
        const householdId = users[0].household_id;
        
        console.log(`Testing for User ID: ${userId}, Household ID: ${householdId}`);
        
        const summary = await DashboardService.getSummary(userId, householdId, {});
        
        console.log("CẤU TRÚC DỮ LIỆU DASHBOARD:");
        console.log("- KPI Cards count:", summary.kpiCards.length);
        console.log("- Flow Data (Income/Expense):", summary.flowData.income.length, "/", summary.flowData.expense.length);
        console.log("- Activities count:", summary.activities.length);
        console.log("- Months count:", summary.months.length);
        
        console.log("\nChi tiết KPI Cards:");
        summary.kpiCards.forEach(c => console.log(`  [${c.title}]: ${c.value} (Icon: ${c.iconName})`));

        process.exit(0);
    } catch (err) {
        console.error("Lỗi kiểm tra API:", err);
        process.exit(1);
    }
}

test();

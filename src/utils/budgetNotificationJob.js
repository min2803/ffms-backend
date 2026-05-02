/**
 * Budget Notification Job
 * Chạy mỗi ngày kiểm tra:
 * 1. 2 ngày trước cuối tháng → nhắc user kiểm tra chi tiêu
 * 2. Ngày 1 tháng mới → nhắc tạo ngân sách nếu chưa có
 */
const db = require("../config/db");
const BudgetModel = require("../models/budgetModel");
const NotificationModel = require("../models/notificationModel");

const JOB_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Kiểm tra notification đã tồn tại hôm nay chưa (anti-duplicate)
 */
async function hasNotificationToday(userId, title) {
    const [rows] = await db.execute(
        `SELECT id FROM notifications
         WHERE user_id = ? AND title = ? AND DATE(created_at) = CURDATE()
         LIMIT 1`,
        [userId, title]
    );
    return rows.length > 0;
}

/**
 * Lấy số ngày trong tháng
 */
function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

/**
 * Lấy tất cả user_id trong 1 household
 */
async function getHouseholdUserIds(householdId) {
    const [rows] = await db.execute(
        "SELECT user_id FROM household_members WHERE household_id = ?",
        [householdId]
    );
    return rows.map(r => r.user_id);
}

/**
 * Lấy tất cả household_id có ít nhất 1 member
 */
async function getAllActiveHouseholds() {
    const [rows] = await db.execute(
        "SELECT DISTINCT household_id FROM household_members"
    );
    return rows.map(r => r.household_id);
}

/**
 * Job chính — chạy mỗi ngày
 */
async function runBudgetNotificationJob() {
    try {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1; // 1-12
        const year = now.getFullYear();
        const daysInMonth = getDaysInMonth(year, month);
        const daysUntilEnd = daysInMonth - day;

        console.log(`[BudgetNotif] Running — ${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} (${daysUntilEnd} days until month end)`);

        // === Case 1: 2 ngày trước cuối tháng → nhắc kiểm tra chi tiêu ===
        if (daysUntilEnd <= 2 && daysUntilEnd >= 0) {
            const title = "Nhắc nhở chi tiêu";
            const message = `Tháng ${month} sắp kết thúc. Hãy kiểm tra chi tiêu và ngân sách của bạn!`;

            // Lấy tất cả household có budget tháng này
            const householdIds = await BudgetModel.getHouseholdsWithBudgetForMonth(month, year);

            let sent = 0;
            for (const hhId of householdIds) {
                const userIds = await getHouseholdUserIds(hhId);
                for (const uid of userIds) {
                    const exists = await hasNotificationToday(uid, title);
                    if (!exists) {
                        await NotificationModel.create(uid, title, message);
                        sent++;
                    }
                }
            }
            console.log(`[BudgetNotif] End-of-month reminders sent: ${sent}`);
        }

        // === Case 2: Ngày 1 → nhắc tạo ngân sách mới nếu chưa có ===
        if (day === 1) {
            const title = "Thiết lập ngân sách";
            const message = `Tháng ${month}/${year} đã bắt đầu. Hãy thiết lập ngân sách cho tháng mới!`;

            const allHouseholds = await getAllActiveHouseholds();

            let sent = 0;
            for (const hhId of allHouseholds) {
                // Kiểm tra household đã có budget tháng mới chưa
                const budgets = await BudgetModel.findByHouseholdAndMonth(hhId, month, year);
                if (budgets.length === 0) {
                    const userIds = await getHouseholdUserIds(hhId);
                    for (const uid of userIds) {
                        const exists = await hasNotificationToday(uid, title);
                        if (!exists) {
                            await NotificationModel.create(uid, title, message);
                            sent++;
                        }
                    }
                }
            }
            console.log(`[BudgetNotif] New-month budget reminders sent: ${sent}`);
        }

        console.log("[BudgetNotif] Job completed successfully");
    } catch (err) {
        console.error("[BudgetNotif] Job error:", err.message);
    }
}

/**
 * Start the daily job
 */
function startBudgetNotificationJob() {
    console.log("[BudgetNotif] Job scheduled (interval: 24h)");

    // Run once on startup (delayed 10s to let DB connect)
    setTimeout(() => {
        runBudgetNotificationJob();
    }, 10000);

    // Then every 24 hours
    setInterval(runBudgetNotificationJob, JOB_INTERVAL);
}

module.exports = { startBudgetNotificationJob, runBudgetNotificationJob };

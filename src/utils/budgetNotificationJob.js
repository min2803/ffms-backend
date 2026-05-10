/**
 * Budget Notification Job
 * Chạy mỗi ngày kiểm tra:
 * 1. Chi tiêu vượt ngân sách → tạo notification + gửi email
 * 2. 2 ngày trước cuối tháng → nhắc user kiểm tra chi tiêu
 * 3. Ngày 1 tháng mới → nhắc tạo ngân sách nếu chưa có
 * 4. AI dự đoán → cảnh báo nếu status = warning/abnormal
 */
const db = require("../config/db");
const BudgetModel = require("../models/budgetModel");
const NotificationModel = require("../models/notificationModel");
const EmailService = require("../services/emailService");
const AiService = require("../services/aiService");

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
 * Lấy user info (name, email)
 */
async function getUserInfo(userId) {
    const [rows] = await db.execute(
        "SELECT id, name, email FROM users WHERE id = ?",
        [userId]
    );
    return rows.length > 0 ? rows[0] : null;
}

/**
 * Lấy tổng chi tiêu tháng hiện tại cho household
 */
async function getMonthlyExpenseTotal(householdId, month, year) {
    const [rows] = await db.execute(
        `SELECT COALESCE(SUM(amount), 0) AS total
         FROM expenses
         WHERE household_id = ? AND MONTH(expense_date) = ? AND YEAR(expense_date) = ?`,
        [householdId, month, year]
    );
    return parseFloat(rows[0].total);
}

/**
 * Lấy tổng ngân sách tháng hiện tại cho household
 */
async function getMonthlyBudgetTotal(householdId, month, year) {
    const [rows] = await db.execute(
        `SELECT COALESCE(SUM(amount), 0) AS total
         FROM budgets
         WHERE household_id = ? AND month = ? AND year = ?`,
        [householdId, month, year]
    );
    return parseFloat(rows[0].total);
}

/**
 * Case mới: Kiểm tra chi tiêu vượt ngân sách + gửi email + AI prediction
 */
async function checkBudgetOverspend(householdId, month, year) {
    const totalExpense = await getMonthlyExpenseTotal(householdId, month, year);
    const totalBudget = await getMonthlyBudgetTotal(householdId, month, year);

    // Bỏ qua nếu chưa set budget hoặc chưa có chi tiêu
    if (totalBudget <= 0 || totalExpense <= 0) return 0;

    const percentage = parseFloat(((totalExpense / totalBudget) * 100).toFixed(1));

    // Chỉ cảnh báo khi vượt 80% budget
    if (percentage < 80) return 0;

    // Lấy AI prediction (nếu service khả dụng)
    let aiData = null;
    try {
        aiData = await AiService.getPrediction(householdId);
    } catch {
        // AI service unavailable — không ảnh hưởng logic chính
    }

    const userIds = await getHouseholdUserIds(householdId);
    let sent = 0;

    // Xác định loại cảnh báo
    let title, message, status;
    if (percentage >= 100) {
        title = "🔴 Vượt ngân sách!";
        message = `Chi tiêu tháng ${month} đã vượt ngân sách (${percentage}%). Tổng chi: ${totalExpense.toLocaleString("vi-VN")}₫ / Ngân sách: ${totalBudget.toLocaleString("vi-VN")}₫`;
        status = "abnormal";
    } else if (percentage >= 90) {
        title = "⚠️ Sắp vượt ngân sách";
        message = `Chi tiêu tháng ${month} đã đạt ${percentage}% ngân sách. Hãy cân nhắc giảm chi tiêu.`;
        status = "warning";
    } else {
        title = "💡 Nhắc nhở chi tiêu";
        message = `Chi tiêu tháng ${month} đã đạt ${percentage}% ngân sách. Tiếp tục theo dõi!`;
        status = "warning";
    }

    // Thêm thông tin AI nếu có
    if (aiData && (aiData.status === "warning" || aiData.status === "abnormal")) {
        message += ` | AI dự đoán: ${Number(aiData.predicted).toLocaleString("vi-VN")}₫ tháng tới (${aiData.message})`;
    }

    for (const uid of userIds) {
        const exists = await hasNotificationToday(uid, title);
        if (exists) continue;

        // Tạo notification in-app
        await NotificationModel.create(uid, title, message);
        sent++;

        // Gửi email cảnh báo (chỉ khi vượt 90%+)
        if (percentage >= 90) {
            const user = await getUserInfo(uid);
            if (user && user.email) {
                await EmailService.sendBudgetWarningEmail(user.email, user.name, {
                    totalExpense,
                    totalBudget,
                    percentage,
                    predicted: aiData?.predicted || null,
                    suggestion: aiData?.suggestion || "Hãy kiểm tra và cắt giảm các khoản chi không cần thiết.",
                    status
                });
            }
        }
    }

    return sent;
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

        // === Case 0: Kiểm tra chi tiêu vượt ngân sách (HÀNG NGÀY) ===
        const allHouseholds = await getAllActiveHouseholds();
        let overspendSent = 0;
        for (const hhId of allHouseholds) {
            overspendSent += await checkBudgetOverspend(hhId, month, year);
        }
        if (overspendSent > 0) {
            console.log(`[BudgetNotif] Budget overspend alerts sent: ${overspendSent}`);
        }

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

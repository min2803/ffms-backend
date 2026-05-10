/**
 * Email Service — Gửi email cảnh báo chi tiêu qua Gmail SMTP
 */
const nodemailer = require("nodemailer");

// Tạo transporter với Gmail SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const EmailService = {
    /**
     * Gửi email cảnh báo vượt ngân sách
     */
    async sendBudgetWarningEmail(toEmail, userName, data) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn("[EmailService] SMTP not configured, skipping email");
            return null;
        }

        const { totalExpense, totalBudget, percentage, predicted, suggestion, status } = data;

        const statusColors = {
            warning: "#f59e0b",
            abnormal: "#ef4444",
            normal: "#10b981"
        };
        const statusLabels = {
            warning: "⚠️ Cảnh báo",
            abnormal: "🔴 Bất thường",
            normal: "✅ Bình thường"
        };

        const color = statusColors[status] || "#f59e0b";
        const label = statusLabels[status] || "⚠️ Cảnh báo";

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 20px; }
                .container { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
                .header { background: linear-gradient(135deg, #0a2540 0%, #1a4b8c 100%); padding: 28px 24px; text-align: center; }
                .header h1 { color: #fff; margin: 0; font-size: 22px; }
                .header p { color: #94a3b8; margin: 6px 0 0; font-size: 13px; }
                .body { padding: 28px 24px; }
                .alert-badge { display: inline-block; background: ${color}; color: #fff; padding: 5px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
                .stat-grid { display: flex; gap: 12px; margin: 18px 0; }
                .stat-card { flex: 1; background: #f8fafc; border-radius: 8px; padding: 14px; text-align: center; }
                .stat-card .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                .stat-card .value { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 4px; }
                .stat-card .value.over { color: #ef4444; }
                .suggestion { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 18px 0; }
                .suggestion p { margin: 0; font-size: 14px; color: #92400e; }
                .footer { text-align: center; padding: 18px 24px; background: #f8fafc; font-size: 12px; color: #94a3b8; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>FFMS</h1>
                    <p>Hệ thống Quản lý Tài chính Gia đình</p>
                </div>
                <div class="body">
                    <span class="alert-badge">${label}</span>
                    <p style="font-size:15px; color:#334155;">
                        Xin chào <strong>${userName}</strong>,
                    </p>
                    <p style="font-size:14px; color:#475569; line-height:1.6;">
                        Hệ thống phát hiện chi tiêu của bạn đã vượt ngân sách tháng này. Dưới đây là chi tiết:
                    </p>

                    <div class="stat-grid">
                        <div class="stat-card">
                            <div class="label">Chi tiêu</div>
                            <div class="value over">${Number(totalExpense).toLocaleString("vi-VN")} ₫</div>
                        </div>
                        <div class="stat-card">
                            <div class="label">Ngân sách</div>
                            <div class="value">${Number(totalBudget).toLocaleString("vi-VN")} ₫</div>
                        </div>
                    </div>

                    <div class="stat-grid">
                        <div class="stat-card">
                            <div class="label">Tỷ lệ sử dụng</div>
                            <div class="value over">${percentage}%</div>
                        </div>
                        ${predicted ? `
                        <div class="stat-card">
                            <div class="label">Dự đoán AI</div>
                            <div class="value">${Number(predicted).toLocaleString("vi-VN")} ₫</div>
                        </div>
                        ` : ""}
                    </div>

                    ${suggestion ? `
                    <div class="suggestion">
                        <p>💡 <strong>Gợi ý:</strong> ${suggestion}</p>
                    </div>
                    ` : ""}
                </div>
                <div class="footer">
                    Email tự động từ FFMS &middot; Vui lòng không trả lời email này
                </div>
            </div>
        </body>
        </html>
        `;

        try {
            const info = await transporter.sendMail({
                from: `"FFMS Notification" <${process.env.SMTP_USER}>`,
                to: toEmail,
                subject: `${label} Chi tiêu vượt ngân sách — FFMS`,
                html
            });
            console.log(`[EmailService] Sent to ${toEmail}: ${info.messageId}`);
            return info;
        } catch (error) {
            console.error(`[EmailService] Failed to send to ${toEmail}:`, error.message);
            return null;
        }
    }
};

module.exports = EmailService;

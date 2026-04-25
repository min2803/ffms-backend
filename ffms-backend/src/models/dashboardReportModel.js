const db = require("../config/db");

const DashboardReportModel = {
    /**
     * Tổng thu nhập theo household trong khoảng thời gian
     */
    async getTotalIncome(householdId, fromDate, toDate) {
        const [rows] = await db.execute(
            `SELECT COALESCE(SUM(amount), 0) AS total
             FROM incomes
             WHERE household_id = ? AND income_date BETWEEN ? AND ?`,
            [householdId, fromDate, toDate]
        );
        return parseFloat(rows[0].total);
    },

    /**
     * Tổng chi tiêu theo household trong khoảng thời gian
     */
    async getTotalExpense(householdId, fromDate, toDate) {
        const [rows] = await db.execute(
            `SELECT COALESCE(SUM(amount), 0) AS total
             FROM expenses
             WHERE household_id = ? AND expense_date BETWEEN ? AND ?`,
            [householdId, fromDate, toDate]
        );
        return parseFloat(rows[0].total);
    },

    /**
     * Chi tiêu theo category trong khoảng thời gian
     */
    async getExpenseByCategory(householdId, fromDate, toDate) {
        const [rows] = await db.execute(
            `SELECT c.name AS category, COALESCE(SUM(e.amount), 0) AS total
             FROM expenses e
             JOIN categories c ON e.category_id = c.id
             WHERE e.household_id = ? AND e.expense_date BETWEEN ? AND ?
             GROUP BY c.id, c.name
             ORDER BY total DESC`,
            [householdId, fromDate, toDate]
        );
        return rows;
    },

    /**
     * Trend theo ngày (income hoặc expense)
     */
    async getTrendByDay(householdId, fromDate, toDate, type) {
        const table = type === "income" ? "incomes" : "expenses";
        const dateCol = type === "income" ? "income_date" : "expense_date";

        const [rows] = await db.execute(
            `SELECT DATE(${dateCol}) AS date, SUM(amount) AS value
             FROM ${table}
             WHERE household_id = ? AND ${dateCol} BETWEEN ? AND ?
             GROUP BY DATE(${dateCol})
             ORDER BY date ASC`,
            [householdId, fromDate, toDate]
        );
        return rows;
    },

    /**
     * Trend theo tháng (income hoặc expense)
     */
    async getTrendByMonth(householdId, fromDate, toDate, type) {
        const table = type === "income" ? "incomes" : "expenses";
        const dateCol = type === "income" ? "income_date" : "expense_date";

        const [rows] = await db.execute(
            `SELECT DATE_FORMAT(${dateCol}, '%Y-%m') AS date, SUM(amount) AS value
             FROM ${table}
             WHERE household_id = ? AND ${dateCol} BETWEEN ? AND ?
             GROUP BY DATE_FORMAT(${dateCol}, '%Y-%m')
             ORDER BY date ASC`,
            [householdId, fromDate, toDate]
        );
        return rows;
    },

    /**
     * Danh sách chi tiết income trong khoảng thời gian
     */
    async getIncomeDetailList(householdId, fromDate, toDate) {
        const [rows] = await db.execute(
            `SELECT i.*, u.name AS user_name, u.email AS user_email
             FROM incomes i
             JOIN users u ON i.user_id = u.id
             WHERE i.household_id = ? AND i.income_date BETWEEN ? AND ?
             ORDER BY i.income_date DESC`,
            [householdId, fromDate, toDate]
        );
        return rows;
    },

    /**
     * Danh sách chi tiết expense trong khoảng thời gian
     */
    async getExpenseDetailList(householdId, fromDate, toDate) {
        const [rows] = await db.execute(
            `SELECT e.*, u.name AS user_name, u.email AS user_email,
                    c.name AS category_name
             FROM expenses e
             JOIN users u ON e.user_id = u.id
             JOIN categories c ON e.category_id = c.id
             WHERE e.household_id = ? AND e.expense_date BETWEEN ? AND ?
             ORDER BY e.expense_date DESC`,
            [householdId, fromDate, toDate]
        );
        return rows;
    }
};

module.exports = DashboardReportModel;

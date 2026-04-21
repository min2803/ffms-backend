const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const householdRoutes = require("./routes/householdRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const utilityRoutes = require("./routes/utilityRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("FFMS API is running");
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "API working"
    });
});

// Route xác thực
app.use("/api/auth", authRoutes);

// Route quản lý user
app.use("/api/users", usersRoutes);

// Route quản lý household
app.use("/api/households", householdRoutes);

// Route quản lý income
app.use("/api/incomes", incomeRoutes);

// Route quản lý expense
app.use("/api/expenses", expenseRoutes);

// Route quản lý budget
app.use("/api/budgets", budgetRoutes);

// Route quản lý category
app.use("/api/categories", categoryRoutes);

// Route quản lý utilities
app.use("/api/utilities", utilityRoutes);

// Route dashboard
app.use("/api/dashboard", dashboardRoutes);

// Route reports
app.use("/api/reports", reportRoutes);

// Route admin (require admin role)
app.use("/api/admin", adminRoutes);

// Route notifications
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
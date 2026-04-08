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

const app = express();

app.use(cors());
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
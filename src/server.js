const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const { verifyToken } = require("./middlewares/authMiddleware");

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
app.use("/auth", authRoutes);

// Route được bảo vệ (dùng để test middleware verifyToken)
app.get("/api/profile", verifyToken, (req, res) => {
    res.json({
        success: true,
        message: "Protected route accessed",
        data: req.user
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
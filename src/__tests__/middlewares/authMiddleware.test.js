const jwt = require("jsonwebtoken");

jest.mock("../../models/tokenBlacklistModel");
jest.mock("../../config/db", () => ({
    execute: jest.fn().mockResolvedValue([[{ household_id: 10 }]]),
}));

const TokenBlacklistModel = require("../../models/tokenBlacklistModel");
const { verifyToken, authorizeRole, requireHousehold } = require("../../middlewares/authMiddleware");

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("authMiddleware", () => {
    describe("verifyToken", () => {
        test("no Authorization header — 401", async () => {
            const req = { headers: {} };
            const res = mockRes();
            const next = jest.fn();

            await verifyToken(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "NO_TOKEN" }));
            expect(next).not.toHaveBeenCalled();
        });

        test("invalid format — 401", async () => {
            const req = { headers: { authorization: "Basic token123" } };
            const res = mockRes();
            const next = jest.fn();

            await verifyToken(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "INVALID_FORMAT" }));
        });

        test("blacklisted token — 401 TOKEN_REVOKED", async () => {
            const token = jwt.sign({ userId: 1, email: "test@example.com", role: "user", householdId: 1 }, process.env.JWT_SECRET);
            const req = { headers: { authorization: `Bearer ${token}` } };
            const res = mockRes();
            const next = jest.fn();

            TokenBlacklistModel.isBlacklisted.mockResolvedValue(true);

            await verifyToken(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "TOKEN_REVOKED" }));
        });

        test("expired token — 401 TOKEN_EXPIRED", async () => {
            const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: "0s" });
            const req = { headers: { authorization: `Bearer ${token}` } };
            const res = mockRes();
            const next = jest.fn();

            TokenBlacklistModel.isBlacklisted.mockResolvedValue(false);

            await new Promise(r => setTimeout(r, 10));
            await verifyToken(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "TOKEN_EXPIRED" }));
        });

        test("valid token — sets req.user and calls next", async () => {
            const payload = { userId: 1, email: "test@example.com", role: "user", householdId: 5 };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
            const req = { headers: { authorization: `Bearer ${token}` } };
            const res = mockRes();
            const next = jest.fn();

            TokenBlacklistModel.isBlacklisted.mockResolvedValue(false);

            await verifyToken(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(req.user.userId).toBe(1);
            expect(req.householdId).toBe(5);
        });
    });

    describe("authorizeRole", () => {
        test("wrong role — 403", () => {
            const middleware = authorizeRole("admin");
            const req = { user: { role: "user" } };
            const res = mockRes();
            const next = jest.fn();

            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).not.toHaveBeenCalled();
        });

        test("correct role — calls next", () => {
            const middleware = authorizeRole("admin", "user");
            const req = { user: { role: "admin" } };
            const res = mockRes();
            const next = jest.fn();

            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe("requireHousehold", () => {
        test("no householdId — 400", () => {
            const req = { householdId: null };
            const res = mockRes();
            const next = jest.fn();

            requireHousehold(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "NO_HOUSEHOLD" }));
        });

        test("has householdId — calls next", () => {
            const req = { householdId: 5 };
            const res = mockRes();
            const next = jest.fn();

            requireHousehold(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
});

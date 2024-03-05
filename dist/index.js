"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
const generateData = (selectedMonth) => {
    const daysInMonth = (0, moment_1.default)(selectedMonth).daysInMonth();
    const data = [];
    for (let i = 0; i < daysInMonth; i++) {
        const date = (0, moment_1.default)(selectedMonth).date(i + 1);
        const label = date.format("D MMM");
        const value = Math.floor(Math.random() * 1000); // Generating random value
        data.push({ id: i, label, value });
    }
    return data;
};
app.get("/", (_req, res) => {
    return res.send("Express Typescript on Vercel");
});
app.get("/metrics", (req, res) => {
    var _a;
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(generateData((_a = req.body) === null || _a === void 0 ? void 0 : _a.month));
});
app.get("/ping", (_req, res) => {
    return res.send("pong 🏓");
});
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map
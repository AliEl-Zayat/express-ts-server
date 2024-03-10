"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
const generateMetrics = (queryDate) => {
    const isoDate = (0, moment_1.default)(queryDate, "YYYY-MM-DD").toISOString();
    const daysInMonth = (0, moment_1.default)(isoDate).daysInMonth();
    const data = [];
    for (let i = 0; i < daysInMonth; i++) {
        const startDate = (0, moment_1.default)(isoDate).date(i + 1);
        const date = startDate.format("YYYY-MM-DD");
        const value = Math.floor(Math.random() * 1000); // Generating random value
        data.push({ id: i, date, value });
    }
    return data;
};
const generateProducts = (quantity) => {
    const products = [];
    for (let i = 0; i < quantity; i++) {
        const product = {
            id: faker_1.faker.datatype.uuid(),
            image: faker_1.faker.image.technics(),
            name: faker_1.faker.commerce.productName(),
            price: faker_1.faker.commerce.price(),
            category: faker_1.faker.commerce.department(),
            description: faker_1.faker.lorem.sentence(),
        };
        products.push(product);
    }
    return products;
};
app.get("/", (_req, res) => {
    return res.send("Express Typescript on Vercel");
});
app.get("/stats", (req, res) => {
    const requiredParamsArray = ["influencerId", "start", "end"];
    const query = req.query;
    const token = req.headers["user-token"];
    const missingParams = requiredParamsArray.filter((param) => !query[param]);
    if (missingParams.length) {
        return res.status(400).send({
            success: false,
            message: `Query parameters ['${missingParams.join("', '")}'] are required`,
        });
    }
    if (!token) {
        return res
            .status(403)
            .send({ success: false, message: "UnAuthenticated user" });
    }
    return res
        .status(200)
        .json(generateMetrics(typeof query.start === "string" && query.start));
});
app.get("/products", (req, res) => {
    const query = req.query;
    if (!query.limit) {
        return res.status(400).send({
            success: false,
            message: "Query parameter 'limit' is required",
        });
    }
    return res.status(200).json(generateProducts(+query.limit));
});
app.get("/ping", (_req, res) => {
    return res.send("pong 🏓");
});
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map
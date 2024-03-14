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
app.get("/categories", (req, res) => {
    const categories = [
        {
            id: 1,
            title: "WOMEN",
            prefix: "women",
        },
        {
            id: 2,
            title: "MEN",
            prefix: "men",
        },
        {
            id: 3,
            title: "KIDS",
            prefix: "kids",
        },
    ];
    return res.status(200).json(categories);
});
app.get("/sections", (req, res) => {
    const sections = [
        {
            id: 1,
            title: "New Arrivals",
            img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_1.jpg?v=1706588336",
            prefix: "new_arrival",
            discount: 0,
        },
        {
            id: 2,
            title: "Best Sellers",
            img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_2.jpg?v=1706588480",
            prefix: "best_sellers",
            discount: 0,
        },
        {
            id: 3,
            title: "Top Rated",
            img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_3.jpg?v=1706588479",
            prefix: "top_rated",
            discount: 0,
        },
        {
            id: 4,
            title: "Brands We Love",
            img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_4.jpg?v=1706588479",
            prefix: "brands_we_love",
            discount: 0,
        },
        {
            id: 5,
            title: "Trending",
            img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_5.jpg?v=1706588479",
            prefix: "trending",
            discount: 0,
        },
        {
            id: 6,
            title: "The Re-imagined",
            img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_6.jpg?v=1706588479",
            prefix: "the_re-imagined",
            discount: 0,
        },
        {
            id: 7,
            title: "Sale",
            img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_7.jpg?v=1706588480",
            prefix: "sale",
            discount: 30,
        },
    ];
    return res.status(200).json(sections);
});
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map
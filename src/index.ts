import { faker } from "@faker-js/faker";
import express, { Request, Response } from "express";
import moment from "moment";
import logger from "morgan";

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(logger("dev"));

const generateMetrics = (queryDate: string) => {
  const isoDate = moment(queryDate, "YYYY-MM-DD").toISOString();
  const daysInMonth = moment(isoDate).daysInMonth();
  const data = [];
  for (let i = 0; i < daysInMonth; i++) {
    const startDate = moment(isoDate).date(i + 1);
    const date = startDate.format("YYYY-MM-DD");
    const value = Math.floor(Math.random() * 1000); // Generating random value
    data.push({ id: i, date, value });
  }
  return data;
};

interface Product {
  id: string;
  image: string;
  name: string;
  price: string;
  category: string;
  description: string;
}
const generateProducts = (quantity: number): Product[] => {
  const products: Product[] = [];
  for (let i = 0; i < quantity; i++) {
    const product: Product = {
      id: faker.datatype.uuid(),
      image: faker.image.technics(),
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      category: faker.commerce.department(),
      description: faker.lorem.sentence(),
    };
    products.push(product);
  }
  return products;
};

app.get("/", (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});

app.get("/stats", (req: Request, res: Response) => {
  const requiredParamsArray = ["influencerId", "start", "end"];
  const query = req.query;
  const token = req.headers["user-token"];

  const missingParams = requiredParamsArray.filter((param) => !query[param]);
  if (missingParams.length) {
    return res.status(400).send({
      success: false,
      message: `Query parameters ['${missingParams.join(
        "', '"
      )}'] are required`,
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

app.get("/products", (req: Request, res: Response) => {
  const query = req.query;
  if (!query.limit) {
    return res.status(400).send({
      success: false,
      message: "Query parameter 'limit' is required",
    });
  }
  return res.status(200).json(generateProducts(+query.limit));
});

app.get("/categories", (req: Request, res: Response) => {
  const categories = [
    {
      "id": 1,
      "title": "WOMEN",
      "prefix": "women",
  },
  {
      "id": 2,
      "title": "MEN",
      "prefix": "men",
  },
  {
      "id": 3,
      "title": "KIDS",
      "prefix": "kids",
  }]
  return res.status(200).json(categories);
});

app.get("/sections", (req: Request, res: Response) => {
  const sections = [
    {
      "id": 1,
      "title": "New Arrivals",
      "img": "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_1.jpg?v=1706588336",
      "prefix": "new_arrival"
  },
  {
      "id": 2,
      "title": "Best Sellers",
      "img": "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_2.jpg?v=1706588480",
      "prefix": "best_sellers"
  },
  {
      "id": 3,
      "title": "Top Rated",
      "img": "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_3.jpg?v=1706588479",
      "prefix": "top_rated"
  },
  {
      "id": 4,
      "title": "Brands We Love",
      "img": "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_4.jpg?v=1706588479",
      "prefix": "brands_we_love"
  },
  {
      "id": 5,
      "title": "Trending",
      "img": "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_5.jpg?v=1706588479",
      "prefix": "trending"
  },
  {
      "id": 6,
      "title": "The Re-imagined",
      "img": "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_6.jpg?v=1706588479",
      "prefix": "the_re-imagined"
  },
  {
      "id": 7,
      "title": "Sale",
      "img": "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_categories_7.jpg?v=1706588480",
      "prefix": "sale"
  }
  ]
  return res.status(200).json(sections);
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

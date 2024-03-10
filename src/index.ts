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

app.get("/ping", (_req: Request, res: Response) => {
  return res.send("pong 🏓");
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

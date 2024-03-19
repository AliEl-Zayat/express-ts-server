import { faker } from "@faker-js/faker";
import express, { Request, Response, Router } from "express";
import moment from "moment";
import logger from "morgan";
import statsRouter from './routes/stats';
import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';

const app = express();
const statsRoute = Router();
statsRouter(statsRoute);
app.use('/api/v1/stats', statsRoute);
const productsRoute = Router();
productsRouter(productsRoute);
app.use('/api/v1/products', productsRoute);
const categoriesRoute = Router();
categoriesRouter(categoriesRoute);
app.use('/api/v1/categories', categoriesRoute);

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

app.get("/sections", (req: Request, res: Response) => {
  type TSection = {
    id: number;
    title: string;
    img: string;
    prefix: string;
    discount: number;
  };

  const sections: TSection[] = [
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

app.get("/banners", (req: Request, res: Response) => {
  type TBanners = { id: number; title: string; img: string };
  const banners: TBanners[] = [
    {
      id: 1,
      title: "Elegance",
      img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/women-slideshow_1.jpg?v=1706496888",
    },
    {
      id: 2,
      title: "Boutique",
      img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/women-slideshow_2.jpg?v=1706581089",
    },
    {
      id: 3,
      title: "Luxury",
      img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/women-slideshow_3.jpg?v=1706581088",
    },
  ];
  return res.status(200).json(banners);
});

app.get("/mightLikeCategories", (req: Request, res: Response) => {
  type TMightLikeCategory = { id: number; title: string; img: string };
  const mightLikeCategories: TMightLikeCategory[] = [
    {
      id: 1,
      title: "Tops",
      img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_ctgr1.jpg?v=1706497731",
    },
    {
      id: 2,
      title: "Sweatshirts",
      img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_ctgr2.jpg?v=1706497729",
    },
    {
      id: 3,
      title: "Swim",
      img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_ctgr3.jpg?v=1706497729",
    },
    {
      id: 4,
      title: "Dresses",
      img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_ctgr4.jpg?v=1706497729",
    },
    {
      id: 5,
      title: "Cardigans",
      img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_ctgr5.jpg?v=1706846710",
    },
  ];
  return res.status(200).json(mightLikeCategories);
});

app.get("/collections", (req: Request, res: Response) => {
  type TCollection = { id: number; title: string; img: string };
  const collections: TCollection[] = [
    {
      id: 1,
      title: "The January Collection",
      img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_btn_1.jpg?v=1706498225",
    },
    {
      id: 2,
      title: "Olympia's picks",
      img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_bn_2.jpg?v=1706498225",
    },
  ];
  return res.status(200).json(collections);
});

app.get("/ecomu-favorites", (req: Request, res: Response) => {
  type TProduct = { id: number; title: string; img: string };
  const mightLikeCategory: TProduct[] = [
    {
      id: 1,
      title: "Tops",
      img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_ctgr1.jpg?v=1706497731",
    },
  ];
  return res.status(200).json(mightLikeCategory);
});

app.get("/story", (req: Request, res: Response) => {
  return res.status(200).json({
    img: "",
    title: "Redefining Fashion Excellence",
    subTitle:
      "Here is your chance to upgrade your wardrobe with a variation of styles",
  });
});

app.get("/products", (req: Request, res: Response) => {
  type TProduct = { id: number; title: string; img: string };
  const mightLikeCategory: TProduct[] = [
    {
      id: 1,
      title: "Tops",
      img: "https://demo-ecomus-global.myshopify.com/cdn/shop/files/wm_ctgr1.jpg?v=1706497731",
    },
  ];
  return res.status(200).json(mightLikeCategory);
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

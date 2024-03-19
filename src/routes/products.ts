import { Request, Response, Router } from "express";
import { generateProducts } from "../index";

export default function productsRouter(router: Router): void {
  router.get("/products", (req: Request, res: Response) => {
    const query = req.query;
    if (!query.limit) {
      return res.status(400).send({
        success: false,
        message: "Query parameter 'limit' is required",
      });
    }
    return res.status(200).json(generateProducts(+query.limit));
  });
}

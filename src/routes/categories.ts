import { Request, Response, Router } from "express";

export default function categoriesRouter(router: Router): void {
  router.get("/categories", (req: Request, res: Response) => {
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
}

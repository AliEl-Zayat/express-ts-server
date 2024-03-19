import { Request, Response, Router } from "express";
import { generateMetrics } from "../index";

export default function statsRouter(router: Router): void {
  router.get("/stats", (req: Request, res: Response) => {
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
}

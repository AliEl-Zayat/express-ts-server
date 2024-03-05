import express, { Request, Response } from "express";
import moment from "moment";

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

const generateData = (queryDate: string) => {
  const isoDate = moment(queryDate, "YYYY-MM-DD").toISOString();
  const daysInMonth = moment(isoDate).daysInMonth();
  const data = [];
  for (let i = 0; i < daysInMonth; i++) {
    const date = moment(isoDate).date(i + 1);
    const label = date.format("D MMM");
    const value = Math.floor(Math.random() * 1000); // Generating random value
    data.push({ id: i, label, value });
  }
  return data;
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
    .json(generateData(typeof query.start === "string" && query.start));
});

app.get("/metrics", (req: Request, res: Response) => {
  if (!req.query.date) {
    return res
      .status(400)
      .send({ success: false, message: "Query parameter 'date' is required" });
  }
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(generateData(req.body.date));
});

app.get("/ping", (_req: Request, res: Response) => {
  return res.send("pong 🏓");
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

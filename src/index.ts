import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 8080;

const generateData = (selectedMonth: string) => {
	const daysInMonth = moment(selectedMonth).daysInMonth();
	const data = [];
	for (let i = 0; i < daysInMonth; i++) {
		const date = moment(selectedMonth).date(i + 1);
		const label = date.format("D MMM");
		const value = Math.floor(Math.random() * 1000); // Generating random value
		data.push({ id: i, label, value });
	}
	return data;
};

app.get("/", (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});

app.get("/metrics", (req: Request, res: Response) => {
	res.setHeader("Content-Type", "application/json");
	res.status(200).json(generateData(req.body?.month as string));
});

app.get("/ping", (_req: Request, res: Response) => {
  return res.send("pong 🏓");
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

import express, { type Request, type Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.get("/", (req: Request, res: Response) => {
	res.send("Welcome to memoir-notes!");
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

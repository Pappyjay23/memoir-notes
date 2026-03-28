import express, { type Request, type Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({
		message: "Welcome to memoir-notes!",
		status: "success",
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

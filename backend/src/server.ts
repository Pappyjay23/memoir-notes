import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.config.js";
import noteRouter from "./routes/note.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use("/api/notes", noteRouter);

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});

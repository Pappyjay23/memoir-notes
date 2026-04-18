import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/db.config.js";
import { swaggerSpec, swaggerUiOptions } from "./config/swagger.config.js";
import authRouter from "./routes/auth.routes.js";
import noteRouter from "./routes/note.routes.js";
import userRouter from "./routes/user.routes.js";
import { originValidator } from "./middlewares/origin.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const devOrigins = ["http://localhost:5173", "http://localhost:5001"];

const prodOrigins = [process.env.CLIENT_URL, process.env.SERVER_URL].filter(
	Boolean,
) as string[];

if (process.env.NODE_ENV === "production" && prodOrigins.length === 0) {
	console.error(
		"WARNING: No CORS origins configured for production. Set CLIENT_URL or SERVER_URL.",
	);
}

const allowedOrigins =
	process.env.NODE_ENV === "production" ? prodOrigins : devOrigins;

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(originValidator(allowedOrigins));

app.get("/", (_, res) => {
	res.redirect("/api-docs");
});

app.get("/health", (_, res) => {
	res.json({ status: "ok", message: "API is running" });
});

app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, swaggerUiOptions),
);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/notes", noteRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err.message === "Not allowed by CORS") {
		return res.status(403).json({
			success: false,
			message: "Origin not allowed",
		});
	}

	console.error(err.stack);

	res.status(500).json({
		success: false,
		message: "Internal server error",
	});
});

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
		process.exit(1);
	});

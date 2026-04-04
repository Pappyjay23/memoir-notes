import express from "express";
import {
	createNote,
	deleteNote,
	getNote,
	getNotes,
	updateNote,
} from "../controllers/note.controller.js";
import { protectAuth } from "../middlewares/auth.middleware.js";
import rateLimiter from "../middlewares/rateLimiter.middleware.js";
import { apiRatelimit } from "../config/upstash.config.js";

const router = express.Router();

router.use(protectAuth);
router.use(rateLimiter(apiRatelimit));

router.get("/", getNotes);
router.get("/:id", getNote);
router.post("/", createNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;

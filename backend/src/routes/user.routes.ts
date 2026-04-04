import express from "express";

import { getCurrentUser } from "../controllers/user.controller.js";
import { protectAuth } from "../middlewares/auth.middleware.js";
import rateLimiter from "../middlewares/rateLimiter.middleware.js";
import { apiRatelimit } from "../config/upstash.config.js";

const router = express.Router();

router.use(protectAuth);
router.use(rateLimiter(apiRatelimit));

router.get("/", getCurrentUser);

export default router;

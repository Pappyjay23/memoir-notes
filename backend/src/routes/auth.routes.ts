import express from "express";
import {
    login,
    logout,
    refresh,
    signup,
} from "../controllers/auth.controller.js";
import rateLimiter from "../middlewares/rateLimiter.middleware.js";
import { authRatelimit } from "../config/upstash.config.js";

const router = express.Router();

router.use(rateLimiter(authRatelimit));

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;

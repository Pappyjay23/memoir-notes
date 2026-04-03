import express from "express";

import { getCurrentUser } from "../controllers/user.controller.js";
import { protectAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protectAuth);

router.get("/", getCurrentUser);

export default router;

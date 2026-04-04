import type { NextFunction, Response } from "express";
import { type Ratelimit } from "@upstash/ratelimit";
import { sendErrorResponse } from "../utils/response.utils.js";
import type { AuthRequest } from "./auth.middleware.js";

const rateLimiter = (ratelimit: Ratelimit) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const identifier = req.user?.id || req.ip;

            const { success } = await ratelimit.limit(identifier!);

            if (!success) {
                return sendErrorResponse(res, 429, "Too many requests");
            }

            next();
        } catch (error) {
            console.log("Rate limit error", error);
            next(error);
        }
    };
};

export default rateLimiter;
import type { CookieOptions, Response } from "express";
import z from "zod";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import {
	sendErrorResponse,
	sendSuccessResponse,
} from "../utils/response.utils.js";
import { signupSchema, loginSchema } from "../schemas/auth.schema.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import {
	generateAccessToken,
	generateRefreshToken,
	getRefreshTokenExpiry,
	getRefreshTokenExpiryMs,
} from "../utils/token.utils.js";

const getRefreshCookieOptions = (): CookieOptions => {
	const isProduction = process.env.NODE_ENV === "production";
	return {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? "none" : "strict",
		maxAge: getRefreshTokenExpiryMs(),
	};
};

export const signup = async (req: AuthRequest, res: Response) => {
	try {
		const validatedData = signupSchema.parse(req.body);

		const existingUser = await User.findOne({ email: validatedData.email });
		if (existingUser) {
			return sendErrorResponse(res, 409, "Email already in use");
		}

		const user = await User.create(validatedData);

		const accessToken = generateAccessToken(user._id.toString(), user.email);
		const refreshToken = generateRefreshToken(user._id.toString());
		const expiresAt = getRefreshTokenExpiry();

		await RefreshToken.create({
			userId: user._id,
			token: refreshToken,
			expiresAt,
		});

		res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

		const userWithoutPassword = user.toJSON();

		sendSuccessResponse(res, 201, "User created successfully", {
			user: userWithoutPassword,
			accessToken,
		});
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			const errors = error.issues.map((issue) => ({
				message: issue.message,
			}));
			return sendErrorResponse(res, 400, "Validation failed", errors);
		}

		sendErrorResponse(res, 500, "Error creating user");
	}
};

export const login = async (req: AuthRequest, res: Response) => {
	try {
		const validatedData = loginSchema.parse(req.body);

		const user = await User.findOne({ email: validatedData.email });

		if (!user) {
			return sendErrorResponse(res, 401, "Invalid email or password");
		}

		const isPasswordValid = await User.comparePassword(
			validatedData.password,
			user.password,
		);

		if (!isPasswordValid) {
			return sendErrorResponse(res, 401, "Invalid email or password");
		}

		const accessToken = generateAccessToken(user._id.toString(), user.email);
		const refreshToken = generateRefreshToken(user._id.toString());
		const expiresAt = getRefreshTokenExpiry();

		await RefreshToken.create({
			userId: user._id,
			token: refreshToken,
			expiresAt,
		});

		res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

		const userWithoutPassword = user.toJSON();

		sendSuccessResponse(res, 200, "Login successful", {
			user: userWithoutPassword,
			accessToken,
		});
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			const errors = error.issues.map((issue) => ({
				message: issue.message,
			}));
			return sendErrorResponse(res, 400, "Validation failed", errors);
		}

		sendErrorResponse(res, 500, "Error logging in");
	}
};

export const logout = async (req: AuthRequest, res: Response) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (refreshToken) {
			await RefreshToken.deleteOne({ token: refreshToken });
		}

		// Match cookie options used when setting the cookie so the browser reliably clears it
		const { maxAge, ...clearOptions } = getRefreshCookieOptions();
		res.clearCookie("refreshToken", clearOptions);

		sendSuccessResponse(res, 200, "Logged out successfully");
	} catch (error) {
		sendErrorResponse(res, 500, "Error logging out");
	}
};

export const refresh = async (req: AuthRequest, res: Response) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return sendErrorResponse(res, 401, "Refresh token not provided");
		}

		const storedToken = await RefreshToken.findOne({ token: refreshToken });

		if (!storedToken) {
			const { maxAge, ...clearOptions } = getRefreshCookieOptions();
			res.clearCookie("refreshToken", clearOptions);
			return sendErrorResponse(res, 401, "Unauthorized");
		}

		// TTL cleanup can lag; enforce expiry at read time
		if (storedToken.expiresAt.getTime() <= Date.now()) {
			await RefreshToken.deleteOne({ token: refreshToken });
			const { maxAge, ...clearOptions } = getRefreshCookieOptions();
			res.clearCookie("refreshToken", clearOptions);
			return sendErrorResponse(res, 401, "Refresh token expired");
		}

		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET as string,
		) as { id: string };

		const user = await User.findById(decoded.id);

		if (!user) {
			return sendErrorResponse(res, 401, "User not found");
		}

		// Delete old refresh token
		await RefreshToken.deleteOne({ token: refreshToken });

		// Generate new tokens
		const newAccessToken = generateAccessToken(user._id.toString(), user.email);
		const newRefreshToken = generateRefreshToken(user._id.toString());
		const expiresAt = getRefreshTokenExpiry();

		// Store new refresh token
		await RefreshToken.create({
			userId: user._id,
			token: newRefreshToken,
			expiresAt,
		});

		res.cookie("refreshToken", newRefreshToken, getRefreshCookieOptions());

		sendSuccessResponse(res, 200, "Token refreshed successfully", {
			accessToken: newAccessToken,
		});
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			const { maxAge, ...clearOptions } = getRefreshCookieOptions();
			res.clearCookie("refreshToken", clearOptions);
			return sendErrorResponse(res, 401, "Refresh token expired");
		}

		if (error instanceof jwt.JsonWebTokenError) {
			const { maxAge, ...clearOptions } = getRefreshCookieOptions();
			res.clearCookie("refreshToken", clearOptions);
			return sendErrorResponse(res, 401, "Invalid refresh token");
		}

		sendErrorResponse(res, 500, "Error refreshing token");
	}
};

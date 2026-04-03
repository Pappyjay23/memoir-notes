import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export const generateAccessToken = (userId: string, email: string) => {
	return jwt.sign(
		{ id: userId, email },
		process.env.JWT_ACCESS_SECRET as string,
		{
			expiresIn: (process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m") as StringValue,
		},
	);
};

export const generateRefreshToken = (userId: string) => {
	return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, {
		expiresIn: (process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d") as StringValue,
	});
};

export const getRefreshTokenExpiryMs = () => {
	const expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d";
	const match = expiresIn.match(/^(\d+)([dhm])$/);

	if (!match) return 7 * 24 * 60 * 60 * 1000;

	const [, value, unit] = match;
	const num = parseInt(value ?? "7");

	switch (unit) {
		case "d": return num * 24 * 60 * 60 * 1000;
		case "h": return num * 60 * 60 * 1000;
		case "m": return num * 60 * 1000;
		default: return 7 * 24 * 60 * 60 * 1000;
	}
};

export const getRefreshTokenExpiry = () => new Date(Date.now() + getRefreshTokenExpiryMs());
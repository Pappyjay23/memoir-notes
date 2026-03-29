import type { Response } from "express";

export const sendResponse = <T>(
	res: Response,
	status: number,
	message: string,
	data?: T,
) => {
	res.status(status).json({
		success: status < 400,
		message,
		data,
	});
};


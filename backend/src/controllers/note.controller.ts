import type { Request, Response } from "express";
import mongoose from "mongoose";
import z from "zod";
import Note from "../models/note.model.js";
import {
	sendErrorResponse,
	sendSuccessResponse,
} from "../utils/response.utils.js";
import { noteSchema, updateNoteSchema } from "../schemas/note.schema.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

export const getNotes = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return sendErrorResponse(res, 401, "Unauthorized");
		}

		const notes = await Note.find({
			user: new mongoose.Types.ObjectId(userId),
		});

		sendSuccessResponse(res, 200, "Notes fetched successfully", notes);
	} catch (error) {
		sendErrorResponse(res, 500, "Error fetching notes");
	}
};

export const getNote = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;
		if (!userId) {
			return sendErrorResponse(res, 401, "Unauthorized");
		}

		const note = await Note.findOne({
			_id: id,
			user: new mongoose.Types.ObjectId(userId),
		});

		if (!note) {
			return sendErrorResponse(res, 404, "Note not found");
		}

		sendSuccessResponse(res, 200, "Note fetched successfully", note);
	} catch (error) {
		sendErrorResponse(res, 500, "Error fetching notes");
	}
};

export const createNote = async (req: AuthRequest, res: Response) => {
	try {
		const validatedData = noteSchema.parse(req.body);
		const { user } = req;

		if (!user?.id) {
			return sendErrorResponse(res, 401, "Unauthorized");
		}

		const note = await Note.create({
			user: new mongoose.Types.ObjectId(user.id),
			...validatedData,
			tag: validatedData.tag ?? "",
			pinned: validatedData.pinned ?? false,
		});

		sendSuccessResponse(res, 201, "Note created successfully", note);
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			const errors = error.issues.map((issue) => ({
				message: issue.message,
			}));
			return sendErrorResponse(res, 400, "Note validation failed", errors);
		}

		sendErrorResponse(res, 500, "Error creating notes");
	}
};

export const updateNote = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;
		if (!userId) {
			return sendErrorResponse(res, 401, "Unauthorized");
		}

		const validatedData = updateNoteSchema.parse(req.body);

		const note = await Note.findOneAndUpdate(
			{ _id: id, user: new mongoose.Types.ObjectId(userId) },
			validatedData,
			{
				returnDocument: "after",
				runValidators: true,
			},
		);

		if (!note) {
			return sendErrorResponse(res, 404, "Note not found");
		}

		sendSuccessResponse(res, 200, "Note fetched successfully", note);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errors = error.issues.map((issue) => ({
				message: issue.message,
			}));
			return sendErrorResponse(res, 400, "Note validation failed", errors);
		}

		sendErrorResponse(res, 500, "Error fetching notes");
	}
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;
		if (!userId) {
			return sendErrorResponse(res, 401, "Unauthorized");
		}

		const note = await Note.findOneAndDelete({
			_id: id,
			user: new mongoose.Types.ObjectId(userId),
		});

		if (!note) {
			return sendErrorResponse(res, 404, "Note not found");
		}

		sendSuccessResponse(res, 200, "Note deleted successfully", note);
	} catch (error) {
		sendErrorResponse(res, 500, "Error fetching notes");
	}
};

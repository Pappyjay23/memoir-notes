import type { Request, Response } from "express";
import z from "zod";
import Note from "../models/note.model.js";
import {
	sendErrorResponse,
	sendSuccessResponse,
} from "../utils/response.utils.js";
import { noteSchema, updateNoteSchema } from "../schemas/note.schema.js";

export const getNotes = async (req: Request, res: Response) => {
	try {
		const notes = await Note.find();

		sendSuccessResponse(res, 200, "Notes fetched successfully", notes);
	} catch (error) {
		sendErrorResponse(res, 500, "Error fetching notes");
	}
};

export const getNote = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const note = await Note.findById(id);

		if (!note) {
			return sendErrorResponse(res, 404, "Note not found");
		}

		sendSuccessResponse(res, 200, "Note fetched successfully", note);
	} catch (error) {
		sendErrorResponse(res, 500, "Error fetching notes");
	}
};

export const createNote = async (req: Request, res: Response) => {
	try {
		const validatedData = noteSchema.parse(req.body);

		const note = await Note.create({
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

export const updateNote = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const validatedData = updateNoteSchema.parse(req.body);

		const note = await Note.findByIdAndUpdate(id, validatedData, {
			returnDocument: "after",
			runValidators: true,
		});

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

export const deleteNote = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const note = await Note.findByIdAndDelete(id);

		if (!note) {
			return sendErrorResponse(res, 404, "Note not found");
		}

		sendSuccessResponse(res, 200, "Note deleted successfully", note);
	} catch (error) {
		sendErrorResponse(res, 500, "Error fetching notes");
	}
};

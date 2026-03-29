import type { Request, Response } from "express";
import { sendResponse } from "../utils/response.utils.js";
import Note from "../models/note.model.js";

export const getNotes = async (req: Request, res: Response) => {
	try {
		const notes = await Note.find();

		sendResponse(res, 200, "Notes fetched successfully", notes);
	} catch (error) {
		sendResponse(res, 500, "Error fetching notes");
	}
};

export const getNote = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const note = await Note.findById(id);

		if (!note) {
			return sendResponse(res, 404, "Note not found");
		}

		sendResponse(res, 200, "Note fetched successfully", note);
	} catch (error) {
		sendResponse(res, 500, "Error fetching notes");
	}
};

export const createNote = async (req: Request, res: Response) => {
	try {
		const note = await Note.create(req.body);

		sendResponse(res, 201, "Note created successfully", note);
	} catch (error) {
		sendResponse(res, 500, "Error creating notes");
	}
};

export const updateNote = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const note = await Note.findByIdAndUpdate(id, req.body, { new: true });

		if (!note) {
			return sendResponse(res, 404, "Note not found");
		}

		sendResponse(res, 200, "Note fetched successfully", note);
	} catch (error) {
		sendResponse(res, 500, "Error fetching notes");
	}
};

export const deleteNote = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const note = await Note.findByIdAndDelete(id);

		if (!note) {
			return sendResponse(res, 404, "Note not found");
		}

		sendResponse(res, 200, "Note deleted successfully", note);
	} catch (error) {
		sendResponse(res, 500, "Error fetching notes");
	}
};

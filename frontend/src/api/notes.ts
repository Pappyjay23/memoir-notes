import type { Note, UpdateNoteData } from "@/context/NoteContext";
import { axiosInstance } from "../config/axios";

export const fetchNotes = async () => {
	const response = await axiosInstance.get("/notes");
	return response.data.data;
};

export const fetchSingleNote = async (id: string) => {
	const response = await axiosInstance.get(`/notes/${id}`);
	return response.data.data;
};

export const createNote = async (data: Note) => {
	const response = await axiosInstance.post(`/notes`, data);
	return response.data.data;
};

export const updateNote = async (id: string, data: UpdateNoteData) => {
	const response = await axiosInstance.patch(`/notes/${id}`, data);
	return response.data.data;
};

export const deleteNote = async (id: string) => {
	const response = await axiosInstance.delete(`/notes/${id}`);
	return response.data.data;
};


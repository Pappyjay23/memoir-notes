import { z } from "zod";

export const noteValidationSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.min(3, "Title must be at least 3 characters")
		.max(100, "Title must not exceed 100 characters"),
	content: z
		.string()
		.min(1, "Content is required")
		.min(10, "Content must be at least 10 characters"),
	tag: z
		.string().optional(),
	pinned: z.boolean().default(false),
});

export type NoteValidationSchema = z.infer<typeof noteValidationSchema>;

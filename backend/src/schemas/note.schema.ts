import { z } from 'zod';

export const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required"),
  tag: z.string().optional(),
});

export const updateNoteSchema = noteSchema.partial();
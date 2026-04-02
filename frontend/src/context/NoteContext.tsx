import { createNote, deleteNote, fetchNotes, updateNote } from "@/api/notes";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type Note = {
	_id: string;
	title: string;
	content: string;
	tag: string;
	pinned: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
};

export type UpdateNoteData = Partial<
	Pick<Note, "title" | "content" | "tag" | "pinned">
>;

type NoteContextType = {
	notes: Note[];
	isNoteLoading: boolean;
	handleCreateNote: (data: Note) => Promise<void>;
	handleDeleteNote: (id: string) => Promise<void>;
	handleUpdateNote: (id: string, data: UpdateNoteData) => Promise<void>;
};

const NoteContext = createContext<NoteContextType | null>(null);

export const NoteContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [notes, setNotes] = useState<Note[]>([]);
	const [isNoteLoading, setIsNoteLoading] = useState(false);

	const sortNotes = (notesArray: Note[]) => {
		const sorted = [...notesArray].sort((a, b) => {
			const pinDiff = (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
			if (pinDiff !== 0) return pinDiff;
			return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
		});

		return sorted;
	};

	const handleCreateNote = async (data: Note) => {
		try {
			const response = await createNote(data);
			setNotes((prevNotes) => sortNotes([...prevNotes, response.data]));
		} catch {
			toast.error("Failed to create note. Please try again.");
		}
	};

	const handleUpdateNote = async (id: string, data: UpdateNoteData) => {
		try {
			const response = await updateNote(id, data);
			setNotes((prevNotes) =>
				sortNotes(
					prevNotes.map((note) => (note._id === id ? response.data : note)),
				),
			);
		} catch {
			toast.error("Failed to update note. Please try again.");
		}
	};

	const handleDeleteNote = async (id: string) => {
		try {
			await deleteNote(id);
			setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
		} catch {
			toast.error("Failed to delete note. Please try again.");
		}
	};

	useEffect(() => {
		const loadNotes = async () => {
			try {
				setIsNoteLoading(true);
				const response = await fetchNotes();
				setNotes(response.data);
				setIsNoteLoading(false);
			} catch {
				toast.error("Failed to load notes. Please refresh the page.");
				setIsNoteLoading(false);
			}
		};

		loadNotes();
	}, []);

	const values = {
		notes,
		isNoteLoading,
		handleCreateNote,
		handleDeleteNote,
		handleUpdateNote,
	};

	return <NoteContext.Provider value={values}>{children}</NoteContext.Provider>;
};

export const UseNote = () => {
	const ctx = useContext(NoteContext);
	if (!ctx) throw new Error("UseNote must be used within NoteContextProvider");
	return ctx;
};

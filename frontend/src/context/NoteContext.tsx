import { createNote, deleteNote, fetchNotes, updateNote } from "@/api/notes";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { UserAuth } from "@/context/AuthContext";

export type Note = {
	_id: string;
	user: string;
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
			const note = await createNote(data);
			setNotes((prevNotes) => sortNotes([...prevNotes, note]));
		} catch {
			toast.error("Failed to create note. Please try again.");
		}
	};

	const handleUpdateNote = async (id: string, data: UpdateNoteData) => {
		const prevNotes = notes;
		setNotes(
			sortNotes(
				prevNotes.map((n) =>
					n._id === id
						? { ...n, ...data, updatedAt: new Date().toISOString() }
						: n,
				),
			),
		);

		try {
			const updatedNote = await updateNote(id, data);
			setNotes(
				sortNotes(prevNotes.map((n) => (n._id === id ? updatedNote : n))),
			);
		} catch {
			setNotes(prevNotes);
			toast.error("Failed to update note. Please try again.");
		}
	};

	const handleDeleteNote = async (id: string) => {
		const prevNotes = notes;

		setNotes(prevNotes.filter((n) => n._id !== id));

		try {
			await deleteNote(id);
		} catch {
			setNotes(prevNotes);
			toast.error("Failed to delete note. Please try again.");
		}
	};

	const { isAuthenticated, isLoading: authLoading } = UserAuth();

	useEffect(() => {
		if (authLoading || !isAuthenticated) {
			if (!authLoading && !isAuthenticated) {
				setNotes([]);
			}
			return;
		}

		const loadNotes = async () => {
			try {
				setIsNoteLoading(true);
				const notesData = await fetchNotes();
				setNotes(() => sortNotes(notesData));
			} catch {
				toast.error("Failed to load notes. Please refresh the page.");
			} finally {
				setIsNoteLoading(false);
			}
		};

		loadNotes();
	}, [authLoading, isAuthenticated]);

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

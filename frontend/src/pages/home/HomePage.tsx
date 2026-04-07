import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import EmptyNote from "@/components/shared/EmptyNote";
import NoteCard from "@/components/shared/NoteCard";
import NoteModal from "@/components/shared/NoteModal";
import SkeletonCard from "@/components/shared/SkeletonCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { UseNote, type Note } from "@/context/NoteContext";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";

const HomePage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingNote, setEditingNote] = useState<Note | undefined>();
	const [notePendingDelete, setNotePendingDelete] = useState<Note | null>(
		null,
	);

	const { notes, isNoteLoading, handleCreateNote, handleUpdateNote, handleDeleteNote } =
		UseNote();

	const filteredNotes = notes.filter((note) => {
		const query = searchQuery.toLowerCase();
		const titleMatch = note.title.toLowerCase().includes(query);
		const contentMatch = note.content.toLowerCase().includes(query);
		return titleMatch || contentMatch;
	});

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleCreateModal = () => {
		setEditingNote(undefined);
		setIsModalOpen(true);
	};

	const handleEditModal = (note: Note) => {
		setEditingNote(note);
		setIsModalOpen(true);
	};

	const handleSave = async (noteData: Note) => {
		if (editingNote) {
			handleUpdateNote(editingNote._id, noteData);
		} else {
			handleCreateNote(noteData);
		}
		setIsModalOpen(false);
	};

	const handlePin = (note: Note) => {
		handleUpdateNote(note._id, { pinned: !note.pinned });
	};

	const handleDeleteModal = (note: Note) => {
		setNotePendingDelete(note);
	};

	const handleConfirmDelete = () => {
		if (notePendingDelete) {
			handleDeleteNote(notePendingDelete._id);
		}
		setNotePendingDelete(null);
	};

	return (
		<div className='flex flex-1 flex-col relative w-full'>
			<h1 className='text-center lg:text-left text-2xl md:text-3xl font-bold tracking-tighter mb-4 px-8'>
				My Notes
			</h1>
			<div className='flex items-center gap-4 px-8'>
				<Input
					type='search'
					placeholder='Search notes...'
					onChange={handleSearchChange}
					className='w-full md:w-[70%] lg:flex-2 mx-auto border-foreground/40 text-xs md:text-sm bg-white/50'
				/>
				<Button
					onClick={handleCreateModal}
					className='hidden lg:flex gap-2 items-center flex-[0.4] w-fit! px-3!'>
					<span>
						<AiOutlinePlus />
					</span>
					Create Note
				</Button>
			</div>

			<div className='mt-8 flex items-center justify-center flex-wrap gap-4 max-h-[70vh] overflow-auto pb-10'>
				{isNoteLoading ? (
					<>
						{Array.from({ length: 6 }).map((_, index) => (
							<SkeletonCard key={index} />
						))}
					</>
				) : (
					<>
						{filteredNotes.length === 0 ? (
							<EmptyNote handleCreateModal={handleCreateModal} />
						) : (
							filteredNotes.map((note) => (
								<Link to={`/note/${note._id}`} key={note._id}>
									<NoteCard
										key={note._id}
										note={note}
										handleEditModal={handleEditModal}
										handleDeleteModal={handleDeleteModal}
										onPin={handlePin}
									/>
								</Link>
							))
						)}
					</>
				)}
			</div>

			<div className='fixed bottom-3 xl:bottom-5 left-0 right-0 flex justify-center lg:hidden'>
				<button
					onClick={handleCreateModal}
					className='p-3 text-white rounded-full cursor-pointer shadow-2xl bg-primary border-2 border-white text-lg active:scale-97 transition-all duration-500 ease-in-out'>
					<AiOutlinePlus />
				</button>
			</div>

			<NoteModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSave}
				initialData={editingNote}
			/>

			<DeleteConfirmModal
				isOpen={notePendingDelete !== null}
				title={notePendingDelete?.title ?? ""}
				onConfirm={handleConfirmDelete}
				onCancel={() => setNotePendingDelete(null)}
			/>
		</div>
	);
};

export default HomePage;

import { fetchSingleNote } from "@/api/notes";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import NoteModal from "@/components/shared/NoteModal";
import Button from "@/components/ui/Button";
import { UseNote, type Note } from "@/context/NoteContext";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { MdPushPin } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

const SingleNotePage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [note, setNote] = useState<Note | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const { notes, handleDeleteNote, handleUpdateNote } = UseNote();

	const loadNote = useCallback(async () => {
		try {
			setIsLoading(true);
			const singleNote = await fetchSingleNote(id!);
			setNote(singleNote);
		} catch (error) {
			console.error("Failed to fetch note:", error);
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	const handleEdit = () => {
		setIsModalOpen(true);
	};

	const handleDelete = () => {
		setIsDeleteModalOpen(true);
	};

	const handleSave = (noteData: Note) => {
		if (note?._id) {
			setNote((prev) =>
				prev
					? { ...prev, ...noteData, updatedAt: new Date().toISOString() }
					: noteData,
			);

			handleUpdateNote(note._id, noteData);
			setIsModalOpen(false);
		}
	};

	const handleConfirmDelete = () => {
		if (note?._id) {
			handleDeleteNote(note?._id);
			setIsDeleteModalOpen(false);
			navigate("/");
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	useEffect(() => {
		if (id) {
			loadNote();
		}
	}, [id, loadNote]);

	useEffect(() => {
		if (!id) return;
		const fromContext = notes.find((n) => n._id === id);
		if (fromContext) {
			setNote(fromContext);
		}
	}, [id, notes]);

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-background'>
				<div className='text-center'>
					<div className='mb-4 inline-block'>
						<div className='w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin'></div>
					</div>
				</div>
			</div>
		);
	}

	if (!note && !isLoading) {
		return (
			<div className='relative min-h-screen w-full flex justify-center items-center -mx-6 -my-10'>
				<div className='flex flex-col items-center gap-2 px-4 text-foreground'>
					<p className='font-bold tracking-tight text-center text-2xl md:text-3xl'>
						Note Not Found
					</p>
					<div className='h-0.75 w-16 bg-foreground/30' />
					<p className='text-xs md:text-sm text-foreground/60 font-medium'>
						Sorry, the note you're looking for doesn't exist.
					</p>
					<Button
						onClick={() => navigate("/")}
						className='mt-6 px-6 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer w-fit!'>
						Back to Home
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col relative w-full max-w-3xl mx-auto'>
			<div className='group relative bg-primary border border-white/30 rounded-xl p-6 md:p-8 flex flex-col min-h-137.5 max-h-[85vh]'>
				<div className='flex flex-col justify-between items-start gap-4 mb-6'>
					<div className='flex-1'>
						<h1 className='text-xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-5 md:mb-3'>
							{note?.title}
						</h1>
						<div className='flex items-center gap-3 flex-wrap'>
							{note?.tag && (
								<div className='flex items-center gap-1 border border-white/50 rounded-full py-1 px-3'>
									<div className='h-1 w-1 bg-white rounded-full'></div>
									<span className='text-[10px] md:text-xs font-bold text-white capitalize tracking-wide'>
										{note?.tag}
									</span>
								</div>
							)}
							{note?.pinned && (
								<div className='flex items-center gap-1 bg-blue-50 text-primary rounded-full py-1.5 px-3'>
									<MdPushPin size={14} />
									<span className='text-[10px] md:text-xs font-medium'>Pinned</span>
								</div>
							)}
							<span className='text-[10px] md:text-xs text-white/90'>
								{note?.updatedAt && formatDate(note?.updatedAt)}
							</span>
						</div>
					</div>

					<div className='flex gap-2'>
						<button
							onClick={handleEdit}
							className='px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white text-foreground font-bold transition-all duration-500 ease-in-out cursor-pointer flex gap-1 md:gap-2 text-[10px] md:text-xs lg:text-sm items-center'>
							<AiOutlineEdit className='text-sm lg:text-lg' />
							<span>Edit</span>
						</button>
						<button
							onClick={handleDelete}
							className='px-3 py-1.5 lg:p-2 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-all duration-500 ease-in-out cursor-pointer flex gap-1 md:gap-2 lg:text-white text-[10px] md:text-xs lg:text-sm items-center'>
							<AiOutlineDelete className='text-sm lg:text-lg' />
							<span>Delete</span>
						</button>
					</div>
				</div>

				<div className='h-px bg-background/10 mb-6'></div>

				<div className='flex-1 overflow-y-auto'>
					<p className='text-white text-xs md:text-sm leading-relaxed whitespace-pre-wrap'>
						{note?.content}
					</p>
				</div>
			</div>

			<NoteModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSave}
				initialData={note || ({} as Note)}
			/>

			<DeleteConfirmModal
				isOpen={isDeleteModalOpen}
				title={note?.title || ""}
				onConfirm={handleConfirmDelete}
				onCancel={() => setIsDeleteModalOpen(false)}
			/>
		</div>
	);
};

export default SingleNotePage;

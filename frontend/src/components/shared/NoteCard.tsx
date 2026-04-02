import { useEffect, useRef, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { MdPushPin } from "react-icons/md";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { UseNote, type Note } from "@/context/NoteContext";

interface NoteCardProps {
	note: Note;
	onPin: (note: Note) => void;
	handleEditModal: (note: Note) => void;
}

const NoteCard = ({
	note,
	onPin,
	handleEditModal,
}: NoteCardProps) => {
	const { title, content, tag, pinned, updatedAt } = note;
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const {handleDeleteNote} =UseNote();

	const date = new Date(updatedAt).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const handleMenuClick = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleEdit = () => {
		handleEditModal(note);
		setIsMenuOpen(false);
	};

	const handleDelete = () => {
		setIsDeleteModalOpen(true);
		setIsMenuOpen(false);
	};

	const handleConfirmDelete = () => {
		handleDeleteNote(note._id);
		setIsDeleteModalOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
		};

		if (isMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isMenuOpen]);

	return (
		<div className='group relative bg-primary border border-white/50 rounded-xl p-5 flex flex-col justify-between min-h-62.5 min-w-62.5 max-w-62.5'>
			<div className='flex justify-between items-center mb-3'>
				<button
					onClick={(e) =>{
						e.preventDefault();
						 onPin(note)
					}}
					className={`p-2 rounded-full transition-all duration-500 ease-in-out cursor-pointer ${
						pinned
							? "bg-blue-50 text-primary"
							: "text-white/60 hover:bg-slate-50 hover:text-primary"
					}`}>
					{pinned ? <MdPushPin size={18} /> : <MdPushPin size={18} />}
				</button>

				<div ref={menuRef} className='relative'>
					<button
						onClick={(e) => {
							e.preventDefault();
							handleMenuClick();
						}}
						className='p-1 cursor-pointer text-white hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all duration-500 ease-in-out'>
						<IoEllipsisVerticalOutline size={18} />
					</button>

					{isMenuOpen && (
						<div className='absolute right-0 mt-1 w-24 bg-white/95 border border-foreground/20 rounded-lg shadow-lg z-50'>
							<button
								onClick={(e) => {
									e.preventDefault();
									handleEdit();
								}}
								className='w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-slate-50 transition-colors duration-200 first:rounded-t-lg cursor-pointer'>
								<AiOutlineEdit size={16} />
								Edit
							</button>
							<button
								onClick={(e) => {
									e.preventDefault();
									handleDelete();
								}}
								className='w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors duration-200 last:rounded-b-lg cursor-pointer'>
								<AiOutlineDelete size={16} />
								Delete
							</button>
						</div>
					)}
				</div>
			</div>

			<div className='flex-1 cursor-pointer'>
				<h3 className='text-lg font-bold text-white tracking-tight leading-tight mb-2 transition-all duration-500 ease-in-out'>
					{title}
				</h3>
				<p className='text-white/80 text-xs leading-relaxed line-clamp-3'>
					{content}
				</p>
			</div>

			<div className='mt-5 pt-4 border-t border-white/10 flex flex-wrap justify-between items-center gap-3'>
				{tag ? (
					<div className='flex items-center gap-1 border border-white/50 rounded-full py-1 px-2 max-w-full'>
						<div className='h-1 w-1 bg-white rounded-full flex shrink-0'></div>
						<span className='text-[10px] font-bold text-white capitalize tracking-wide text-center truncate'>
							{tag}
						</span>
					</div>
				) : (
					<span></span>
				)}

				<span className='text-[11px] font-medium text-white'>{date}</span>
			</div>

			<DeleteConfirmModal
				isOpen={isDeleteModalOpen}
				title={title}
				onConfirm={handleConfirmDelete}
				onCancel={() => setIsDeleteModalOpen(false)}
			/>
		</div>
	);
};

export default NoteCard;

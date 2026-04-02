import { AiOutlineDelete } from "react-icons/ai";

interface DeleteConfirmModalProps {
	isOpen: boolean;
	title: string;
	onConfirm: () => void;
	onCancel: () => void;
	isLoading?: boolean;
}

const DeleteConfirmModal = ({
	isOpen,
	title,
	onConfirm,
	onCancel,
	isLoading = false,
}: DeleteConfirmModalProps) => {
	if (!isOpen) return null;

	return (
		<>
			<div
				className='fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300'
				onClick={onCancel}
			/>

			<div
				onClick={onCancel}
				className='fixed inset-0 flex items-center justify-center z-50 px-4'>
				<div
					onClick={(e) => e.stopPropagation()}
					className='bg-background border border-foreground rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
					<div className='flex flex-col items-center gap-4 mb-6'>
						<div className='p-3 bg-red-50/20 rounded-full'>
							<AiOutlineDelete size={28} className='text-red-500' />
						</div>
						<div className='text-center'>
							<h2 className='text-lg font-bold text-primary mb-2'>
								Delete Note
							</h2>
							<p className='text-sm text-foreground line-clamp-2'>
								Are you sure you want to delete "{title}"?
							</p>
						</div>
					</div>

					<p className='text-xs text-foreground/80 text-center mb-6 bg-red-50/10 border border-red-500/30 rounded-lg px-3 py-2'>
						This action cannot be undone.
					</p>

					<div className='flex gap-3'>
						<button
							onClick={onCancel}
							disabled={isLoading}
							className='flex-1 px-4 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-lg hover:bg-white/10 transition-colors duration-200 disabled:opacity-50 cursor-pointer'>
							Cancel
						</button>
						<button
							onClick={onConfirm}
							disabled={isLoading}
							className='flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
							{isLoading ? "Deleting..." : "Delete"}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default DeleteConfirmModal;

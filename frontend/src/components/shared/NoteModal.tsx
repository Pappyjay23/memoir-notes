import type { Note } from "@/context/NoteContext";
import { noteValidationSchema } from "@/schemas/noteSchema";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Input from "../ui/Input";

interface NoteModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (noteData: Note) => void;
	initialData?: Note;
	isLoading?: boolean;
}

type FieldErrors = {
	title?: string;
	content?: string;
	tag?: string;
};

const emptyNote: Note = {
	user: "",
	title: "",
	content: "",
	tag: "",
	pinned: false,
	createdAt: "",
	updatedAt: "",
	__v: 0,
	_id: "",
};

const NoteModal = ({
	isOpen,
	onClose,
	onSave,
	initialData,
	isLoading = false,
}: NoteModalProps) => {
	const [formData, setFormData] = useState<Note>(() => {
		return initialData || emptyNote;
	});

	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

	useEffect(() => {
		if (isOpen) {
			setFormData(initialData || emptyNote);
			setFieldErrors({});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value, type } = e.target;

		// Clear error for this field when user starts typing
		if (fieldErrors[name as keyof FieldErrors]) {
			setFieldErrors((prev) => ({
				...prev,
				[name]: undefined,
			}));
		}

		if (type === "checkbox") {
			const target = e.target as HTMLInputElement;
			setFormData((prev) => ({
				...prev,
				[name]: target.checked,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const validationResult = noteValidationSchema.safeParse({
			title: formData.title,
			content: formData.content,
			tag: formData.tag,
			pinned: formData.pinned,
		});

		if (!validationResult.success) {
			const errors: FieldErrors = {};
			validationResult.error.issues.forEach((error) => {
				const fieldName = error.path[0] as string;
				errors[fieldName as keyof FieldErrors] = error.message;
			});
			setFieldErrors(errors);
			return;
		}

		setFieldErrors({});
		onSave(formData);
	};

	const handleClose = () => {
		onClose();
		setFormData(emptyNote);
		setFieldErrors({});
	};

	return (
		<>
			<div
				className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out ${
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={handleClose}
			/>

			<div
				className={`fixed right-0 top-0 h-screen w-full max-w-md bg-background shadow-2xl z-50 transition-transform duration-500 ease-in-out transform ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}>
				<div className='flex justify-between items-center px-6 py-4 border-b border-foreground/10'>
					<h2 className='text-2xl tracking-tight font-bold text-primary'>
						{initialData ? "Edit Note" : "Create Note"}
					</h2>
					<button
						onClick={handleClose}
						disabled={isLoading}
						className='p-2 hover:bg-white/70 rounded-lg transition-all duration-500 ease-in-out cursor-pointer'>
						<AiOutlineClose size={20} className='text-primary' />
					</button>
				</div>

				<form
					id='note-form'
					onSubmit={handleSubmit}
					className='p-6 space-y-5 overflow-y-auto h-[calc(100vh-140px)]'>
					<div className='space-y-1.5'>
						<label
							htmlFor='title'
							className='text-sm font-semibold text-primary'>
							Title
						</label>
						<Input
							id='title'
							type='text'
							name='title'
							value={formData.title}
							onChange={handleChange}
							placeholder='Enter note title...'
							disabled={isLoading}
							className={`w-full px-4 py-2 bg-white/20 border rounded-lg focus:outline-none transition-all duration-200 text-foreground placeholder-foreground/50 text-sm ${
								fieldErrors.title
									? "border-red-500/60 focus:border-red-500 focus:bg-red-50/10"
									: "border-foreground/30 focus:border-primary/60 focus:bg-white/30"
							}`}
						/>
						{fieldErrors.title && (
							<p className='text-xs text-red-500 font-medium'>
								{fieldErrors.title}
							</p>
						)}
					</div>

					<div className='space-y-1.5'>
						<label
							htmlFor='content'
							className='text-sm font-semibold text-primary'>
							Content
						</label>
						<textarea
							id='content'
							name='content'
							value={formData.content}
							onChange={handleChange}
							placeholder='Enter note content...'
							disabled={isLoading}
							rows={8}
							className={`w-full px-4 py-2 bg-white/20 border rounded-lg focus:outline-none transition-all duration-200 text-foreground placeholder-foreground/50 text-sm resize-none ${
								fieldErrors.content
									? "border-red-500/60 focus:border-red-500 focus:bg-red-50/10"
									: "border-foreground/30 focus:border-primary/60 focus:bg-white/30"
							}`}
						/>
						{fieldErrors.content && (
							<p className='text-xs text-red-500 font-medium'>
								{fieldErrors.content}
							</p>
						)}
					</div>

					<div className='space-y-1.5'>
						<label htmlFor='tag' className='text-sm font-semibold text-primary'>
							Tag
						</label>
						<Input
							id='tag'
							type='text'
							name='tag'
							value={formData.tag}
							onChange={handleChange}
							placeholder='e.g., Personal, Work, Ideas...'
							disabled={isLoading}
							className={`w-full px-4 py-2 bg-white/20 border rounded-lg focus:outline-none transition-all duration-200 text-foreground placeholder-foreground/50 text-sm ${
								fieldErrors.tag
									? "border-red-500/60 focus:border-red-500 focus:bg-red-50/10"
									: "border-foreground/30 focus:border-primary/60 focus:bg-white/30"
							}`}
						/>
						{fieldErrors.tag && (
							<p className='text-xs text-red-500 font-medium'>
								{fieldErrors.tag}
							</p>
						)}
					</div>

					<div className='flex items-center gap-3 py-2'>
						<input
							type='checkbox'
							id='pinned'
							name='pinned'
							checked={formData.pinned}
							onChange={handleChange}
							disabled={isLoading}
							className='w-5 h-5 cursor-pointer accent-primary'
						/>
						<label
							htmlFor='pinned'
							className='text-sm font-medium text-primary cursor-pointer'>
							Pin this note
						</label>
					</div>
				</form>

				<div className='absolute bottom-0 left-0 right-0 bg-background border-t border-foreground/10 p-6 flex gap-3'>
					<button
						onClick={handleClose}
						disabled={isLoading}
						className='flex-1 px-4 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-lg hover:bg-white/10 transition-colors duration-200 disabled:opacity-50 cursor-pointer'>
						Cancel
					</button>
					<button
						type='submit'
						form='note-form'
						disabled={isLoading}
						className='flex-1 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
						{isLoading ? "Saving..." : initialData ? "Update" : "Create"}
					</button>
				</div>
			</div>
		</>
	);
};

export default NoteModal;

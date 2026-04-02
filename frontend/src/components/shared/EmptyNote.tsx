import { GiNotebook } from "react-icons/gi";
import Button from "@/components/ui/Button";

interface EmptyNoteProps {
	handleCreateModal: () => void;
}

const EmptyNote = ({ handleCreateModal }: EmptyNoteProps) => {
	return (
		<div className='flex flex-col items-center justify-center py-16 px-8 max-w-md mx-auto text-center'>
			<div className='bg-primary/10 rounded-full p-4 mb-6'>
				<GiNotebook className='size-15 md:size-20 text-primary' />
			</div>
			<h3 className='text-2xl tracking-tight font-bold mb-2'>No notes yet</h3>
			<p className='text-xs md:text-sm mb-8'>
				Ready to organize your thoughts? Create your first note to get started
				on your journey.
			</p>
			<Button onClick={handleCreateModal} className='w-fit!'>
				Create Your First Note
			</Button>
		</div>
	);
};

export default EmptyNote;

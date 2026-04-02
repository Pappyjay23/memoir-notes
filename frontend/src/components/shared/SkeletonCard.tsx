const SkeletonCard = () => {
	return (
		<div className='bg-white/30 border border-foreground/30 rounded-xl p-5 flex flex-col justify-between min-h-50 min-w-62.5 max-w-62.5 animate-pulse'>
			{/* Top Row */}
			<div className='flex justify-between items-center mb-3'>
				<div className='w-8 h-8 bg-white/20 rounded-full' />
				<div className='w-6 h-6 bg-white/20 rounded-lg' />
			</div>

			{/* Title */}
			<div className='space-y-3 flex-1'>
				<div className='h-5 bg-white/20 rounded-md' />
				<div className='space-y-2'>
					<div className='h-3 bg-white/20 rounded-md' />
					<div className='h-3 bg-white/20 rounded-md' />
					<div className='h-3 bg-white/20 rounded-md w-3/4' />
				</div>
			</div>

			{/* Bottom Row */}
			<div className='mt-5 pt-4 border-t border-primary/30 flex justify-between items-center gap-3'>
				<div className='h-6 w-24 bg-white/20 rounded-full' />
				<div className='h-4 w-20 bg-white/20 rounded-md' />
			</div>
		</div>
	);
};

export default SkeletonCard;

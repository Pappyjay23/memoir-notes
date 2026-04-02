import Navbar from "@/components/ui/Navbar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='h-screen bg-background pb-24 overflow-hidden'>
			<div className='max-w-4xl mx-auto px-4 md:p-6'>
				<Navbar />
				<main className='mt-18 md:mt-16'>{children}</main>
			</div>
		</div>
	);
};

export default AppLayout;

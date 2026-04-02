import Logo from "@/assets/images/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className='fixed top-0 left-0 right-0 z-30 bg-background'>
			<div className='max-w-4xl mx-auto p-4 md:p-6 flex justify-between items-center'>
				<div className='flex justify-center items-center gap-0.5'>
					<img src={Logo} alt='Logo' className='w-5 md:w-6 h-5 md:h-6' />
					<Link
						to='/'
						className='text-base md:text-xl font-bold tracking-tighter'>
						Memoir Notes
					</Link>
				</div>
				<div className='flex items-center gap-3'>
					<div className='w-8 h-8 bg-primary rounded-full border-2 border-white shadow-md overflow-hidden cursor-pointer'>
						<img
							// 				src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
							// user?.full_name || user?.email || "Cinera"}`}
							src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${"Peace"}`}
							alt='profile'
						/>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;

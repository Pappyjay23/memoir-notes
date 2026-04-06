import Logo from "@/assets/images/logo.png";
import { Link } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useRef, useState } from "react";

const Navbar = () => {
	const { user, logout } = UserAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const displayName = useMemo(() => {
		if (!user) return "";
		const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
		return fullName || user.email;
	}, [user]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
		};

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") setIsMenuOpen(false);
		};

		if (isMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isMenuOpen]);

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
					<div ref={menuRef} className='relative'>
						<button
							type='button'
							onClick={() => setIsMenuOpen((v) => !v)}
							aria-haspopup='menu'
							aria-expanded={isMenuOpen}
							className='w-8 h-8 bg-primary rounded-full border-2 border-white shadow-md overflow-hidden cursor-pointer active:scale-97 transition-all duration-500 ease-in-out'>
							<img
								src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
									user?.firstName || user?.email || "New User"
								}`}
								alt='profile'
							/>
						</button>

						{isMenuOpen && (
							<div
								role='menu'
								aria-label='User menu'
								className='absolute right-0 mt-2 w-40 md:w-44 bg-white/95 border border-foreground/20 rounded-xl shadow-lg z-50 overflow-hidden'>
								<div className='px-4 py-3'>
									<p className='text-sm font-bold text-primary truncate'>
										{displayName}
									</p>
									{user?.email && (
										<p className='text-xs font-medium text-foreground/60 truncate'>
											{user.email}
										</p>
									)}
								</div>
								<div className='h-px bg-foreground/10' />
								<button
									role='menuitem'
									type='button'
									onClick={() => {
										setIsMenuOpen(false);
										logout();
									}}
									className='w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer'>
									Logout
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;

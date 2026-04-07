import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export const ErrorPage = () => {
	const navigate = useNavigate();

	return (
		<section
			className={`relative min-h-svh overflow-hidden w-full flex justify-center items-center`}>
			<div className='flex flex-col items-center gap-2 px-4 relative z-3 text-foreground'>
				<h1 className='text-[5rem] md:text-[7rem] font-extrabold -mt-3.75 md:-mt-7.5 flex items-center tracking-tighter'>
					404
				</h1>
				<div className='h-0.75 w-20 bg-foreground -mt-3.75 md:-mt-3.75' />
				<p className='font-bold tracking-tight text-center text-[1.5rem] md:text-[2rem]'>
					{`Page Not Found`}
				</p>
				<div className='text-xs flex items-center gap-1 font-bold'>
					<span>Sorry the page you're looking for does not exist.</span>
				</div>
				<Button className="mt-4 md:text-sm" onClick={() => navigate("/")}>Back To Home</Button>
			</div>
		</section>
	);
};

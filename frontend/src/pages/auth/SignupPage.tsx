import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Logo from "@/assets/images/logo.png";
import { UserAuth } from "@/context/AuthContext";

const SignupPage = () => {
	const { setIsAuthenticated } = UserAuth();

	return (
		<div className='min-h-screen flex flex-col justify-center items-center px-4'>
			<div className='flex items-center gap-1 mb-4'>
				<img src={Logo} alt='Logo' className='w-6 h-6' />
				<h3 className='text-lg md:text-xl font-bold tracking-tighter'>Memoir Notes</h3>
			</div>
			<h3 className='text-3xl md:text-4xl font-bold tracking-tighter mb-2'>
				Let's Get Started.
			</h3>
			<p className='text-xs md:text-sm text-center'>
				Easily manage your notes in one place with ease and efficiency.
			</p>

			<div className='mt-8 flex gap-4'>
				<Link to='/'>
					<Button onClick={() => setIsAuthenticated(true)}>Sign up</Button>
				</Link>
			</div>
		</div>
	);
};

export default SignupPage;

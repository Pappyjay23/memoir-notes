import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Logo from "@/assets/images/logo.png";
import { UserAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";

const LoginPage = () => {
	const { setIsAuthenticated } = UserAuth();

	return (
		<div className='min-h-screen flex flex-col justify-center items-center px-4'>
			<div className='max-w-lg mx-auto w-full'>
				<div className='flex justify-center items-center gap-1 mb-4'>
					<img src={Logo} alt='Logo' className='w-6 h-6' />
					<h3 className='text-lg md:text-xl font-bold tracking-tighter'>
						Memoir Notes
					</h3>
				</div>
				<h3 className='text-3xl md:text-4xl font-bold tracking-tighter mb-2 text-center'>
					Hey, Welcome Back.
				</h3>
				<form className='flex flex-col w-full mt-8 gap-4'>
					<Input type='email' placeholder='Email' />
					<Input type='password' placeholder='Password' />
				</form>

				<div className='mt-8 flex gap-4 w-full'>
					<Link to='/' className='w-full'>
						<Button onClick={() => setIsAuthenticated(true)}>Login</Button>
					</Link>
				</div>
				<div className='text-xs md:text-sm mt-4 flex justify-center gap-1 items-center'>
					<p>Don't have an account yet?</p>
					<Link to='/signup' className='font-bold'>
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;

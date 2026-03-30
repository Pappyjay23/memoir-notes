import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Logo from "@/assets/images/logo.png";

const LandingPage = () => {
	return (
		<div className='min-h-screen flex flex-col justify-center items-center px-4'>
			<img src={Logo} alt='Logo' className=' w-20 md:w-24 h-20 md:h-24' />
			<h3 className='text-3xl md:text-4xl font-bold tracking-tighter mb-2'>Memoir Notes</h3>
			<p className='text-xs md:text-sm text-center'>
				Easily manage your notes in one place with ease and efficiency.
			</p>

			<div className='mt-8 flex gap-4'>
				<Link to='/login'>
					<Button btnStyle='outlined'>Login</Button>
				</Link>
				<Link to='/signup'>
					<Button>Sign up</Button>
				</Link>
			</div>
		</div>
	);
};

export default LandingPage;

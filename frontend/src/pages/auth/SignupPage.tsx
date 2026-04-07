import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Logo from "@/assets/images/logo.png";
import { UserAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import { signupSchema } from "@/schemas/authSchema";
import type { SignupFormData } from "@/schemas/authSchema";
import type { ZodIssue } from "zod/v3";

type FieldErrors = {
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
};

const SignupPage = () => {
	const { signup } = UserAuth();
	const [formData, setFormData] = useState<SignupFormData>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		if (fieldErrors[e.target.name as keyof FieldErrors]) {
			setFieldErrors((prev) => ({
				...prev,
				[e.target.name]: undefined,
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const validatedData = signupSchema.parse(formData);
			setFieldErrors({});
			setIsLoading(true);
			await signup(
				validatedData.firstName,
				validatedData.lastName,
				validatedData.email,
				validatedData.password,
			);
		} catch (error: any) {
			if (error.name === "ZodError") {
				const errors: FieldErrors = {};
				error.issues.forEach((err: ZodIssue) => {
					const key = err.path[0] as keyof FieldErrors;
					if (key) errors[key] = err.message;
				});
				setFieldErrors(errors);
			} else {
				// Error already handled in context
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-svh flex flex-col justify-center items-center px-4'>
			<div className='max-w-lg mx-auto w-full'>
				<div className='flex justify-center items-center gap-1 mb-4'>
					<img src={Logo} alt='Logo' className='w-6 h-6' />
					<h3 className='text-lg md:text-xl font-bold tracking-tighter'>
						Memoir Notes
					</h3>
				</div>
				<h3 className='text-3xl md:text-4xl font-bold tracking-tighter mb-2 text-center'>
					Let's Get Started.
				</h3>
				<form
					className='flex flex-col w-full mt-8 gap-4'
					onSubmit={handleSubmit}>
					<div className='flex flex-col space-y-2'>
						<Input
							type='text'
							name='firstName'
							placeholder='First name'
							value={formData.firstName}
							onChange={handleChange}
						/>
						{fieldErrors.firstName && (
							<p className='text-xs text-red-500 font-medium'>
								{fieldErrors.firstName}
							</p>
						)}
					</div>
					<div className='flex flex-col space-y-2'>
						<Input
							type='text'
							name='lastName'
							placeholder='Last name'
							value={formData.lastName}
							onChange={handleChange}
						/>
						{fieldErrors.lastName && (
							<p className='text-xs text-red-500 font-medium'>
								{fieldErrors.lastName}
							</p>
						)}
					</div>
					<div className='flex flex-col space-y-2'>
						<Input
							type='text'
							name='email'
							placeholder='Email'
							value={formData.email}
							onChange={handleChange}
						/>
						{fieldErrors.email && (
							<p className='text-xs text-red-500 font-medium'>
								{fieldErrors.email}
							</p>
						)}
					</div>
					<div className='flex flex-col space-y-2'>
						<Input
							type='password'
							name='password'
							placeholder='Password'
							value={formData.password}
							onChange={handleChange}
						/>
						{fieldErrors.password && (
							<p className='text-xs text-red-500 font-medium'>
								{fieldErrors.password}
							</p>
						)}
					</div>
					<Button type='submit' disabled={isLoading}>
						{isLoading ? "Signing up..." : "Sign up"}
					</Button>
				</form>
				<div className='text-xs md:text-sm mt-4 flex justify-center gap-1 items-center'>
					<p>Already have an account?</p>
					<Link to='/login' className='font-bold'>
						Login
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignupPage;

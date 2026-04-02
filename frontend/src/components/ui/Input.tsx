import { useState } from "react";
import { IoEyeOffSharp, IoEyeSharp, IoSearch } from "react-icons/io5";

interface InputProps {
	id?: string;
	name?: string;
	value?: string;
	type?: string;
	placeholder?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
    disabled?: boolean;
}
const Input = ({
	type = "text",
	placeholder = "",
	onChange,
	className,
	value,
	id,name, disabled
}: InputProps) => {
	const [togglePassword, setTogglePassword] = useState(false);

	if (type === "password") {
		return (
			<div
				className={`border border-foreground py-2 px-3 rounded-full relative ${className}`}>
				<input
					id={id}
                    name={name}
					type={togglePassword ? "text" : "password"}
					placeholder={placeholder}
                    disabled={disabled}
					value={value}
					onChange={onChange}
					className={`border-0 outline-none w-[90%] text-xs md:text-sm`}
				/>
				<div
					onClick={() => setTogglePassword((prev) => !prev)}
					className='absolute right-4 top-[50%] translate-y-[-50%] z-5 cursor-pointer'>
					{togglePassword ? <IoEyeSharp /> : <IoEyeOffSharp />}
				</div>
			</div>
		);
	}

	if (type === "search") {
		return (
			<div
				className={`border border-foreground py-2 px-3 rounded-full relative ${className}`}>
				<div
					onClick={() => setTogglePassword((prev) => !prev)}
					className='absolute left-4 top-[50%] translate-y-[-50%] z-5 cursor-pointer'>
					<IoSearch />
				</div>
				<input
					id={id}
                    name={name}
					type={"text"}
					placeholder={placeholder}
                    disabled={disabled}
					value={value}
					onChange={onChange}
					className={`border-0 outline-none w-full pl-7 text-xs md:text-sm`}
				/>
			</div>
		);
	}

	return (
		<input
			id={id}
            name={name}
			type={type}
			placeholder={placeholder}
            disabled={disabled}
			value={value}
			onChange={onChange}
			className={`${className} border border-foreground outline-none py-2 px-3 rounded-full text-xs md:text-sm`}
		/>
	);
};

export default Input;

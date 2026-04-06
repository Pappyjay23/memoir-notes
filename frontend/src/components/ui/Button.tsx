interface ButtonProps {
	children: React.ReactNode;
	btnStyle?: "filled" | "outlined";
	onClick?: () => void;
	className?: string;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
}

const Button = ({
	children,
	btnStyle = "filled",
	onClick,
	className,
	type = "button",
	disabled = false,
}: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			type={type}
			disabled={disabled}
			className={`text-sm font-bold ${btnStyle === "filled" ? "bg-[#272a3f] hover:bg-[#1E2131] text-white" : "border border-[#272a3f] text-black"} py-2.5 px-10 md:px-13 w-full rounded-full cursor-pointer active:scale-97 transition-all duration-500 ease-in-out ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
			{children}
		</button>
	);
};

export default Button;

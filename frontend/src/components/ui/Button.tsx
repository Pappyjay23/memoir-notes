interface ButtonProps {
	children: React.ReactNode;
	btnStyle?: "filled" | "outlined";
	onClick?: () => void;
	className?: string;
}

const Button = ({
	children,
	btnStyle = "filled",
	onClick,
	className,
}: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			className={`text-sm font-bold ${btnStyle === "filled" ? "bg-[#272a3f] hover:bg-[#1E2131] text-white" : "border border-[#272a3f] text-black"} py-2.5 px-10 md:px-13 w-full rounded-full cursor-pointer active:scale-97 transition-all duration-500 ease-in-out ${className}`}>
			{children}
		</button>
	);
};

export default Button;

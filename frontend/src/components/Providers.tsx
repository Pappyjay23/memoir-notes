import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "@/context/AuthContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<BrowserRouter>
				<AuthContextProvider>{children}</AuthContextProvider>
			</BrowserRouter>
		</>
	);
};

export default Providers;

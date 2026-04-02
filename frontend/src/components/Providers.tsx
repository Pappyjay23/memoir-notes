import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "@/context/AuthContext";
import { NoteContextProvider } from "@/context/NoteContext";
import { Toaster } from "sonner";

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<BrowserRouter>
				<AuthContextProvider>
					<NoteContextProvider>{children}</NoteContextProvider>
				</AuthContextProvider>
				<Toaster
					theme='dark'
					position='top-center'
					toastOptions={{
						classNames: {
							toast:
								"group flex gap-3 w-full backdrop-blur-xl border border-white/10 threed-effect rounded-2xl p-4 shadow-2xl font-google-sans bg-black/80 transition-all duration-300",

							success: "text-teal-400!",

							error: "text-red-400!",

							info: "text-blue-400!",

							title: "text-sm font-semibold",
							description: "text-xs text-white/60",

							actionButton:
								"bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-1 text-xs",

							closeButton: "text-white/40 hover:text-white",
						},
					}}
				/>
			</BrowserRouter>
		</>
	);
};

export default Providers;

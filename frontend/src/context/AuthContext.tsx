import type { AuthResponse } from "@/api/auth";
import { loginAuth, logoutAuth, refreshAuth, signupAuth } from "@/api/auth";
import { getCurrentUser } from "@/api/user";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";

type User = {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
};

type AuthContextType = {
	isAuthenticated: boolean;
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
	isLoading: boolean;
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	signup: (
		firstName: string,
		lastName: string,
		email: string,
		password: string,
	) => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<User | null>(null);
	const navigate = useNavigate();

	const clearAuthState = () => {
		Cookies.remove("accessToken");
		setUser(null);
		setIsAuthenticated(false);
	};

	// Check auth on mount
	useEffect(() => {
		const checkAuth = async () => {
			const hasToken = Cookies.get("accessToken");

			if (!hasToken) {
				try {
					const { accessToken } = await refreshAuth();
					Cookies.set("accessToken", accessToken);
				} catch (err) {
					const status = axios.isAxiosError(err)
						? err.response?.status
						: undefined;
					if (status === 401 || status === 403) {
						clearAuthState();
					}
					setIsLoading(false);
					return;
				}
			}

			try {
				const currentUser = await getCurrentUser();
				setUser(currentUser);
				setIsAuthenticated(true);
			} catch (err) {
				// Only hard-logout when refresh is definitively invalid (401/403).
				// For transient errors (network/5xx), don't force a logout; allow the user to retry.
				const status = axios.isAxiosError(err)
					? err.response?.status
					: undefined;
				if (status === 401 || status === 403) {
					clearAuthState();
				}
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	// Check for forced logout
	useEffect(() => {
		const handleForcedLogout = () => {
			clearAuthState();
			navigate("/login");
		};

		window.addEventListener("auth:logout", handleForcedLogout);
		return () => window.removeEventListener("auth:logout", handleForcedLogout);
	}, [navigate]);

	const login = async (email: string, password: string) => {
		try {
			const response: AuthResponse = await loginAuth({ email, password });
			Cookies.set("accessToken", response.accessToken);
			setUser(response.user);
			setIsAuthenticated(true);
			toast.success("Login successful");
			navigate("/");
		} catch (error: any) {
			console.log("Error logging in:", error);
			toast.error(error?.message || "Login failed");
			throw error;
		}
	};

	const signup = async (
		firstName: string,
		lastName: string,
		email: string,
		password: string,
	) => {
		try {
			const response: AuthResponse = await signupAuth({
				firstName,
				lastName,
				email,
				password,
			});
			Cookies.set("accessToken", response.accessToken);
			setUser(response.user);
			setIsAuthenticated(true);
			toast.success("Signup successful");
			navigate("/");
		} catch (error: any) {
			toast.error(error?.message || "Signup failed");
			throw error;
		}
	};

	const logout = async () => {
		try {
			await logoutAuth();
		} catch (error) {
			// Even if logout fails, clear local state
			console.log("Logout error", error);
		} finally {
			clearAuthState();
			navigate("/login");
		}
	};

	const values = {
		isAuthenticated,
		setIsAuthenticated,
		isLoading,
		user,
		login,
		signup,
		logout,
	};

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("UserAuth must be used within AuthContextProvider");
	return ctx;
};

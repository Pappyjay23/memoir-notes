import HomePage from "@/pages/home/HomePage";
import { ErrorPage } from "@/pages/error/ErrorPage";
import LandingPage from "@/pages/landing/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";

export type RouteConfig = {
	path: string;
	element: React.ReactNode;
	isPrivate?: boolean;
	label?: string;
};

export const routeConfig: RouteConfig[] = [
	// Public Routes
	{
		path: "/landing",
		element: <LandingPage />,
		isPrivate: false,
		label: "Landing",
	},
	{
		path: "/login",
		element: <LoginPage />,
		isPrivate: false,
		label: "Login",
	},
	{
		path: "/signup",
		element: <SignupPage />,
		isPrivate: false,
		label: "Sign Up",
	},

	// Protected Routes
	{
		path: "/",
		element: <HomePage />,
		isPrivate: true,
		label: "Home",
	},

	// Error Route
	{
		path: "*",
		element: <ErrorPage />,
		label: "Not Found",
	},
];

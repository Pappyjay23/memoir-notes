import { Navigate } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";

type PublicRouteProps = {
	children: React.ReactNode;
};

export const PublicRoute = ({ children }: PublicRouteProps) => {
	const { isAuthenticated, isLoading } = UserAuth();

	if (isLoading) {
		return <LoadingState />;
	}

	return !isAuthenticated ? <>{children}</> : <Navigate to='/' replace />;
};

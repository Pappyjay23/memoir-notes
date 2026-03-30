import { Navigate } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";

type PrivateRouteProps = {
	children: React.ReactNode;
};

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
	const { isAuthenticated, isLoading } = UserAuth();

	if (isLoading) {
		return <LoadingState />;
	}

	return isAuthenticated ? <>{children}</> : <Navigate to='/landing' replace />;
};

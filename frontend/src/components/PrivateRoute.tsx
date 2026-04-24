import { Navigate, Outlet } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";

export const PrivateRoute = () => {
	const { isAuthenticated, isLoading } = UserAuth();

	if (isLoading) {
		return <LoadingState />;
	}

	return isAuthenticated ? <Outlet /> : <Navigate to='/landing' replace />;
};

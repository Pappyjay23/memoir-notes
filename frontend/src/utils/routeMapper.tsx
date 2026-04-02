import { Route } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import { PublicRoute } from "@/components/PublicRoute";
import type { RouteConfig } from "@/routes";

export const mapRoutes = (routes: RouteConfig[]) => {
	return routes.map((route) => {
		const { path, element, isPrivate } = route;

		// Error route (no guard)
		if (path === "*") {
			return <Route key={path} path={path} element={element} />;
		}

		// Private route
		if (isPrivate) {
			return (
				<Route
					key={path}
					path={path}
					element={<PrivateRoute>{element}</PrivateRoute>}
				/>
			);
		}

		// Public route (blocks authenticated users)
		return (
			<Route
				key={path}
				path={path}
				element={<PublicRoute>{element}</PublicRoute>}
			/>
		);
	});
};

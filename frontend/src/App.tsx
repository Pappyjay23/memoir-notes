import { mapRoutes } from "@/utils/routeMapper";
import { Routes } from "react-router-dom";
import {  routes } from "@/routes";

const App = () => {
	return <Routes>{mapRoutes(routes)}</Routes>;
};

export default App;

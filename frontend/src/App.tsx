import { Routes } from "react-router-dom";
import { routeConfig } from "@/config/routes";
import { mapRoutes } from "@/utils/routeMapper";

const App = () => {
	return <Routes>{mapRoutes(routeConfig)}</Routes>;
};

export default App;

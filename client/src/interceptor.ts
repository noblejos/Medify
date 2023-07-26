import axios from "axios";
import Cookies from "js-cookie";

// Add a request interceptor
axios.interceptors.request.use(
	(config) => {
		const token = Cookies.get("auth");

		config.headers["Content-Type"] = "application/json";
		config.headers["Access-Control-Allow-Origin"] = "*";

		if (token) {
			config.headers["Authorization"] = "Bearer " + token;
		}
		return config;
	},
	(error) => {
		Promise.reject(error);
	},
);

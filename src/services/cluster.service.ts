import config from "config";
import { connect } from "./mongoose.service";

import app from "./app.service";
const _port = config.get<string>("port");

const port = _port || 4000;

export default (async () => {
	// open mongoose connection
	connect();

	app.listen(port, () => {
		console.info(`Server started on port: ${port}`);
	});
})();

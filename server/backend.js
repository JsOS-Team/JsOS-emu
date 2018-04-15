class Backend {
	recv(msg) {
		console.log("Recv", msg);

		if(msg === "begin") {
			this.app = require("../app");
		}
	}
};

module.exports = new Backend;
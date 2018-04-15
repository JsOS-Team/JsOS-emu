const API = require("./api");

class Backend {
	recv(msg) {
		if(msg === "begin") {
			this.app = require("../app");
			this.api = new API(this);

			let command = this.app.commands[0];
			this.app.call(command, "", this.api, this.cb);
		} else {
			this.api.recv(msg);
		}
	}

	cb(res) {
		console.log("Result: " + res);
	}
};

module.exports = new Backend;
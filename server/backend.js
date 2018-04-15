class Backend {
	recv(msg) {
		console.log("Recv", msg);
	}
};

module.exports = new Backend;
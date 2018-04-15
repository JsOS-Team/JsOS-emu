const http = require("http");

function handleRequest(req, res) {
	res.end("Hello!");
}

function run() {
	// Choose random port, so that noone can steal local files from Web
	let port = Math.floor(Math.random() * 3000) + 2000;
	console.log("Listening on port " + port);

	http.createServer(handleRequest).listen(port);
}

module.exports = run;
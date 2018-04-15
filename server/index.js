const WebSocket = require("ws");
const browserOpen = require("../utils/openBrowser");
const path = require("path");

let backend;


function handleWebSocket(ws) {
	console.log("Connected to WebSocket");

	ws.on("message", msg => backend.recv(JSON.parse(msg)));
	backend.send = msg => ws.send(JSON.stringify(msg));
}


module.exports = b => {
	const port = 7505;
	const url = `file:///${path.resolve(__dirname, "../gui/index.html")}`;

	backend = b;

	console.log("Listening on port " + port);
	console.log("Opening " + url);


	browserOpen(url);

	new WebSocket.Server({port}).on("connection", handleWebSocket);

	return port;
}
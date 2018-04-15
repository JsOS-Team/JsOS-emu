const WebSocket = require("ws");

let port, backend;


function handleWebSocket(ws) {
	console.log("Connected to WebSocket");

	ws.on("message", msg => backend.recv(JSON.parse(msg)));
	backend.send = msg => ws.send(JSON.stringify(msg));
}

module.exports = b => {
	backend = b;

	// Choose random port, so that noone can steal local files from Web
	port = Math.floor(Math.random() * 3000) + 2000;
	console.log("Listening on port " + port);

	new WebSocket.Server({port: port}).on("connection", handleWebSocket);
}
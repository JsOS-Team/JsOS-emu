const WebSocket = require("ws");
const browserOpen = require("../utils/openBrowser");

let backend;


function handleWebSocket(ws) {
	console.log("Connected to WebSocket");

	ws.on("message", msg => backend.recv(JSON.parse(msg)));
	backend.send = msg => ws.send(JSON.stringify(msg));
}

// Choose random port, so that noone can steal local files from Web
function getPort() {
	return Number(process.argv[2]) || Math.floor(Math.random() * 3000) + 2000;
}


module.exports = b => {
	const port = getPort()
	backend = b;

	console.log("Listening on port " + port);

	browserOpen(`http://localhost:${port}`);

	new WebSocket.Server({port}).on("connection", handleWebSocket);

	return port;
}

const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const fs = require("fs");

let port, wsPort, backend;


function handleRequest(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");

	let url = req.url;
	if(url.indexOf("..") > -1) {
		res.writeHead(403, "Forbidden");
		res.end("Don't use ..");
		return;
	}

	url = path.join(".", url);

	if(url == "_port") {
		res.end(wsPort.toString());
		return;
	}

	console.log("Output " + url);
	let stream = fs.createReadStream(url);
	stream.on("error", e => {
		if(e.code == "EISDIR") {
			fs.readdir(url, (e, dir) => {
				if(e) {
					res.writeHead(500, "Server error");
					res.end(":'(");
					return;
				}

				res.end("{DIR}\n" + dir.join("\n"));
			});
		} else {
			res.writeHead(404, "File not found");
			res.end(":(");
		}
	});
	stream.pipe(res);
}

function handleWebSocket(ws) {
	console.log("Connected to WebSocket");

	ws.on("message", msg => backend.recv(msg));
	backend.send = msg => backend.send(msg);
}

function run(b) {
	backend = b;

	// Choose random port, so that noone can steal local files from Web
	port = Math.floor(Math.random() * 3000) + 2000;
	wsPort = Math.floor(Math.random() * 3000) + 2000;
	console.log("Listening on port " + port);
	console.log("Listening websocket on port " + wsPort);

	http.createServer(handleRequest).listen(port);
	new WebSocket.Server({port: wsPort}).on("connection", handleWebSocket);
}

module.exports = run;
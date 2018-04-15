const http = require("http");
const path = require("path");
const fs = require("fs");

function handleRequest(req, res) {
	let url = req.url;
	if(url.indexOf("..") > -1) {
		res.writeHead(403, "Forbidden");
		res.end("Don't use ..");
		return;
	}

	url = path.join(".", url);

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

function run() {
	// Choose random port, so that noone can steal local files from Web
	let port = Math.floor(Math.random() * 3000) + 2000;
	console.log("Listening on port " + port);

	http.createServer(handleRequest).listen(port);
}

module.exports = run;
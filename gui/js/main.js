// TODO: don't get port via prompt
const port = parseInt(prompt("HTTP port:"));
let ws = null;

function get(url) {
	return fetch(`http://localhost:${port}/${url}`)
		.then(res => res.text());
}

function connect() {
	return get("_port")
		.then(wsPort => {
			ws = new WebSocket(`ws://localhost:${wsPort}`);

			return new Promise((resolve, reject) => {
				ws.onopen = resolve;
				ws.onerror = reject;
			});
		});
}

function sendWs(msg) {
	ws.send(JSON.stringify(msg));
}


// Connect as soon as possible
connect().then(() => sendWs("begin"));
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
			ws.onmessage = e => {
				recv(JSON.parse(e.data));
			};

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
let vga, keyboard;
connect().then(() => {
	sendWs("begin");

	let table = document.getElementById("vga");
	vga = new VGA(table);
	keyboard = new Keyboard(document.body);
	keyboard.onKeydown(char => {
		sendWs({action: "keydown", char});
	});
	keyboard.onKeyup(char => {
		sendWs({action: "keyup", char});
	});
});

function recv(msg) {
	if(msg.action == "setXY") {
		vga.setXY(msg.x, msg.y, msg.char, msg.fg, msg.bg);
	} else if(msg.action == "setOffset") {
		vga.setOffset(msg.offset, msg.char, msg.fg, msg.bg);
	} else if(msg.action == "clear") {
		vga.clear();
	} else if(msg.action == "scrollUp") {
		vga.scrollUp();
	} else if(msg.action == "scrollDown") {
		vga.scrollDown();
	}
}
// TODO: don't get port via prompt
const port = parseInt(prompt("HTTP port:"));

function get(url) {
	return fetch(`http://localhost:${port}/${url}`)
		.then(res => res.text());
}
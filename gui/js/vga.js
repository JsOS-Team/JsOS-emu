const w = 80;
const h = 25;

const color = {
	0 : "#000",
	1 : "#008",
	2 : "#080",
	3 : "#088",
	4 : "#800",
	5 : "#808",
	6 : "#880",
	7 : "#888",
	8 : "#666",
	9 : "#00F",
	10: "#0F0",
	11: "#0FF",
	12: "#F00",
	13: "#F0F",
	14: "#FF0",
	15: "#FFF"
};

function setCharAt(table, x, y, char, fg, bg) {
	bg = bg || "BLACK";
	fg = fg || "WHITE";

	let td = table.rows[y].cells[x];
	td.style.backgroundColor = color[bg];
	td.style.color = color[fg];
	td.textContent = char;
}

class VGA {
	constructor(table) {
		this.table = table;

		this.table.innerHTML = "";
		for(let y = 0; y < h; y++) {
			let tr = document.createElement("tr");
			for(let x = 0; x < w; x++) {
				let td = document.createElement("td");
				tr.appendChild(td);
			}
			this.table.appendChild(tr);
		}
	}
	setXY(x, y, char, fg, bg) {
		setCharAt(this.table, x, y, String(char), fg, bg);
	}
	setOffset(offset, char, fg, bg) {
		let x = offset % w;
		let y = Math.floor(offset / w);
		setCharAt(this.table, x, y, String(char), fg, bg);
	}
	clear(bg) {
		for(let y = 0; y < h; y++) {
			for(let x = 0; x < w; x++) {
				setCharAt(this.table, x, y, " ", bg, bg);
			}
		}
	}
	scrollUp(bg) {
		// FIXME: A hack
		let tr = this.table.rows[0];
		let parent = tr.parentNode;
		parent.removeChild(tr);
		parent.appendChild(tr);

		for(let x = 0; x < w; x++) {
			setCharAt(this.table, x, h - 1, " ", bg, bg);
		}
	}
	scrollDown(bg) {
		return debug('Not implemented!');
	}
};
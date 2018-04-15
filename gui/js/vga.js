const w = 80;
const h = 25;

const color = {
	"BLACK": "#000",
	"BLUE": "#008",
	"GREEN": "#080",
	"CYAN": "#088",
	"RED": "#800",
	"MAGENTA": "#808",
	"BROWN": "#880",
	"LIGHTGRAY": "#888",
	"DARKGRAY": "#666",
	"LIGHTBLUE": "#00F",
	"LIGHTGREEN": "#0F0",
	"LIGHTCYAN": "#0FF",
	"LIGHTRED": "#F00",
	"LIGHTMAGENTA": "#F0F",
	"YELLOW": "#FF0",
	"WHITE": "#FFF"
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
			setCharXY(this.table, x, h - 1, " ", bg, bg);
		}
	}
	scrollDown(bg) {
		return debug('Not implemented!');
	}
};
class Printer {
	constructor(buffer) {
		this.buffer = buffer;
		this.posCurrent = 0;
		this.w = 80;
		this.h = 25;

		this.refresh = this.refresh.bind(this);
		this.scrollUp = this.scrollUp.bind(this);
		this.scrollDown = this.scrollDown.bind(this);
		this.clear = this.clear.bind(this);
		this.fill = this.fill.bind(this);
		this.print = this.print.bind(this);
		this.moveOffset = this.moveOffset.bind(this);
		this.moveTo = this.moveTo.bind(this);
		this.useControls = this.useControls.bind(this);
		this.buffer.clear(this.color.BLACK);
		this.refresh();
	}

	refresh() {
		// Does nothing in emulation mode, content already refreshed
	}

	// Найдите десять отличий
	scrollUp() {
		this.buffer.scrollUp(this.color.BLACK);
		this.posCurrent -= this.w;
	}
	scrollDown() {
		this.buffer.scrollDown(this.color.BLACK);
		this.posCurrent -= this.w;
	}

	clear(color=this.color.BLACK) {
		this.buffer.clear(color);
		this.posCurrent = 0;
	}

	fill(color) {
		return this.clear(color);
	}

	useControls(symbol, prevsymbol="\0", setcolor=[this.color.WHITE, this.color.BLACK]) {
		const code = symbol.charCodeAt(0);

		if(code >= 0x0 && code <= 0xF && prevsymbol.charCodeAt() === 0x1B) {
			setcolor[0] = code;
			return true;
		}

		if(code >= 0x10 && code <= 0x1F && prevsymbol.charCodeAt() === 0x1B) {
			setcolor[1] = code - 0x10;
			return true;
		}

		return code === 0x1B;
	}

	print(textOpt="", repeat=1, fg=this.color.WHITE, bg=this.color.BLACK) {
		const text = String(textOpt);
		const currentcolor = [fg, bg];

		for(let j = 0; j < repeat; j++) {
			for(const i in text) {
				const c = text[i];

				if(this.useControls(c, text[i - 1], currentcolor)) {
					continue;
				}

				if(c === "\n") {
					this.posCurrent -= this.posCurrent % this.w;
					this.posCurrent += this.w;
				}
				if(this.posCurrent >= this.w * this.h) {
					this.scrollUp();
				}
				if(c !== "\n") {
					this.buffer.setOffset(this.posCurrent++, c, ...currentcolor);
				}
			}
		}
	}

	moveOffset(offsetOpt) {
		const offset = offsetOpt | 0;
		let newPos = this.posCurrent + offset;

		if(newPos < 0) {
			newPos = 0;
		} else if(newPos >= this.w * this.h) {
			newPos = (this.w * this.h) - 1;
		}

		this.posCurrent = newPos;
	}

	moveTo(xOpt, yOpt) {
		let x = xOpt;
		let y = yOpt;

		if(x < 0) {
			x = 0;
		} else if(x >= this.w) {
			x = this.w - 1;
		}
		if(y < 0) {
			y = 0;
		} else if(y >= this.h) {
			y = this.h - 1;
		}
		this.posCurrent = (y * this.w) + x;
	}
}


class TTY extends Printer {
	constructor(backend, keyboard) {
		super(new VGABuffer);

		this._backend = backend;
		this._keyboard = keyboard;

		this.isReading = false;
	}

	read(cb) {
		if(this.isReading) {
			throw new Error("nested terminal read is not allowed");
		}

		const editor = new LineEditor();

		this.isReading = true;

		function addinput(keyinfo) {
			switch(keyinfo.type) {
				case "character":
					printer.print(keyinfo.character);
					cb(keyinfo.character);
					this._keyboard.onKeydown.remove(addinput);
					break;
				case "backspace":
					break;
				case "enter":
					printer.print('\n');
					isReading = false;
					setTimeout(() => cb('\n'), 0);
					this._keyboard.onKeydown.remove(addinput);
					break;
				default:
					break;
			}
		}

		this._keyboard.onKeydown.add(addinput);
		editor.drawCursor();
	}

	readLine(cb) {
		if(this.isReading) {
			throw new Error("nested terminal read is not allowed");
		}

		const editor = new LineEditor();

		this.isReading = true;

		function addinput(keyinfo) {
			switch(keyinfo.type) {
				case "kpleft":
					editor.moveCursorLeft();
					break;
				case "kpright":
					editor.moveCursorRight();
					break;
				case "kpup":
					editor.previous();
					break;
				case "kpdown":
					editor.next();
					break;
				case "kphome":
					editor.moveCursorStart();
					break;
				case "kpend":
					editor.moveCursorEnd();
					break;
				case "kppageup":
					printer.scrollUp(0);
					break;
				case "kppagedown":
					printer.scrollDown(0);
					break;
				case "character":
					editor.putChar(keyinfo.character);
					break;
				case "backspace":
					editor.removeChar();
					break;
				case "kpdel":
					editor.removeCharRight();
					break;
				case "enter":
					editor.removeCursor();
					printer.print('\n');
					isReading = false;
					setTimeout(() => {
						let text = editor.getText();

						editor.writeHistory(text);
						if(text[0] === "#") {
							let result;

							text = text.slice(1);
							try {
								result = `=>${eval(text)}\n`; // eslint-disable-line no-eval
							} catch (e) {
								result = `\nError: ${e}\n`;
							}
							printer.print(result);
							return cb("");
						}
						return cb(editor.getText());
					}, 0);
					this._keyboard.onKeydown.remove(addinput);
					break;
				default:
			}
		}

		this._keyboard.onKeydown.add(addinput);
		editor.drawCursor();
	};
};


class StdioInterface {
	constructor() {
		this.onread = () => {};
		this.onwrite = () => {};
		this.onwriteerror = () => {};
		this.onsetcolor = () => {};
		this.onsetbackgroundcolor = () => {};
		this.onmoveto = () => {};

		this.write = this.write.bind(this);
		this.writeError = this.writeError.bind(this);
		this.writeLine = this.writeLine.bind(this);
		this.setColor = this.setColor.bind(this);
		this.setBackgroundColor = this.setBackgroundColor.bind(this);
		this.clear = this.clear.bind(this);
		this.read = this.read.bind(this);
		this.readLine = this.readLine.bind(this);
	}

	get color() {
		return this.getColor();
	}
	get bgcolor() {
		return this.getBgColor();
	}

	// stdout
	write(...text) {
		this.onwrite(text.join(" "));
	}
	writeLine(...text) {
		this.onwrite(`${text.join(" ")}\n`);
	}
	setColor(fg) {
		this.onsetcolor(fg);
	}
	setBackgroundColor(bg) {
		this.onsetbackgroundcolor(bg);
	}
	moveTo(x, y) {
		this.onmoveto(x, y);
	}
	clear() {
		this.onclear();
	}

	// stdin
	read(cb) {
		this.onread(cb);
	}
	readLine(cb) {
		// If there's onreadline, use it.
		if(this.onreadline) {
			this.onreadline(cb);
		} else {
			// Else, use onread.
			// Downside: no cusor moving or backspace.
			// TODO: Fix downside.

			let text = "";

			function addinput(char) {
				if(char !== "\n") {
					text += char;
					this.onread(addinput);
				} else {
					cb(text);
				}
			}
			this.onread(addinput);
		}
	}

	// stderr
	writeError(...text) {
		this.write("\n");
		if(typeof text[0] === "string") {
			this.onwriteerror(text.join(" "));
		} else {
			this.onwriteerror(text[0].stack);
		}
		this.setColor("green");
		this.write("\n>>");
	}
};



class StdIO extends StdioInterface {
	constructor(backend, keyboard) {
		super();

		this.tty = new TTY(backend, keyboard);

		this.fgcolor = this.tty.color.WHITE;
		this.bgcolor = this.tty.color.BLACK;
	}

	onwrite(text) {
		this.tty.print(text, 1, this.fgcolor, this.bgcolor);
	}
	onclear() {
		this.tty.clear();
	}
	onsetcolor(fg) {
		if(!fg) {
			this.fgcolor = this.tty.color.WHITE;
			return;
		}

		this.fgcolor = this.tty.color[String(fg).toUpperCase()];
	}
	onsetbackgroundcolor(bg) {
		if(!bg) {
			this.bgcolor = this.tty.color.BLACK;
			return;
		}

		this.bgcolor = this.tty.color[String(bg).toUpperCase()];
	}
	onmoveto(x, y) {
		this.tty.moveTo(x, y);
	}
	onread(cb) {
		this.tty.read(cb);
	}
	onreadline(cb) {
		this.tty.readLine(cb);
	}
	onwriteerror(error) {
		this.tty.print(error, 1, this.tty.color.RED);
	}
	print(...args) {
		this.onwrite(...args);
	}

	getColor() {
		return this.fgcolor;
	}
	getBgColor() {
		return this.bgcolor;
	}
};

module.exports = StdIO;
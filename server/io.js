class TTY {
	constructor(backend, keyboard) {
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



class StdIO extends TTY {
};

module.exports = StdIO;
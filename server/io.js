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

module.exports = StdIO;



class StdIO extends TTY {
};

module.exports = StdIO;
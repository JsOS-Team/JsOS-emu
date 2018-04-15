class Keyboard {
	constructor(node) {
		this.node = node;

		this.node.addEventListener("keydown", this.onkeydown.bind(this));
		this.node.addEventListener("keyup", this.onkeyup.bind(this));

		this.listeners = {keydown: [], keyup: []};
	}

	onKeydown(f) {
		this.listeners.keydown.push(f);
	}
	offKeydown(f) {
		this.listeners.keydown.splice(this.listeners.keydown.indexOf(f), 1);
	}
	onKeyup(f) {
		this.listeners.keyup.push(f);
	}
	offKeyup(f) {
		this.listeners.keyup.splice(this.listeners.keyup.indexOf(f), 1);
	}

	onkeydown(e) {
		let code = this.toCode(e);
		this.listeners.keydown.forEach(f => f(code));
	}
	onkeyup(e) {
		let code = this.toCode(e);
		this.listeners.keyup.forEach(f => f(code));
	}

	toCode(e) {
		if(e.key.length == 1) {
			// Some simple key
			return {
				type: "character",
				character: e.key,
				alt: e.altKey,
				shift: e.shiftKey,
				ctrl: e.ctrlKey
			};
		}

		const type = {
			"ControlLeft" : "leftctrl",
			"ShiftLeft"   : "leftshift",
			"ShiftRight"  : "rightshift",
			"AltLeft"     : "leftalt",
			"ScrollLock"  : "scrllock",
			"ArrowUp"     : "kpup",
			"ArrowLeft"   : "kpleft",
			"ArrowRight"  : "kpright",
			"ArrowDown"   : "kpdown",
			"Delete"      : "kpdel",
			"ControlRight": "rightctrl",
			"AltRight"    : "rightalt",
			"Delete"      : "del",
			"ContextMenu" : "menu",
			"PageUp"      : "kppageup",
			"PageDown"    : "kppagedown",
			"Home"        : "kphome",
			"End"         : "kpend"
		}[e.code] || e.code.toLowerCase();

		return {
			type,
			character: "",
			alt: e.altKey,
			shift: e.shiftKey,
			ctrl: e.ctrlKey
		};
	}
};
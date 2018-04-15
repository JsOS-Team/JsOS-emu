const StdIO = require("./io");

class API {
	constructor(backend) {
		this._backend = backend;

		this.handlers = {
			onKeydown: [],
			onKeyup: []
		};

		this.keyboard = {
			onKeydown: {
				add(f) {
					this.handlers.onKeydown.push(f);
				},
				remove(f) {
					this.handlers.onKeydown.splice(this.handlers.onKeydown.indexOf(f), 1);
				},
				dispatch(...args) {
					this.handlers.onKeydown.forEach(f => f(...args));
				}
			},
			onKeyup: {
				add(f) {
					this.handlers.onKeyup.push(f);
				},
				remove(f) {
					this.handlers.onKeyup.splice(this.handlers.onKeyup.indexOf(f), 1);
				},
				dispatch(...args) {
					this.handlers.onKeyup.forEach(f => f(...args));
				}
			}
		};
		this.stdio = new StdIO(this._backend, this.keyboard);

		// TODO: this.mouse
	}

	recv(msg) {

	}
};

module.exports = API;
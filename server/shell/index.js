function prompt(app, command, api, cb) {
	const io = api.stdio;

	io.setColor("yellow");
	io.write(`$ start ${command} `);
	io.setColor("white");
	io.readLine(args => {
		app.call(command, args, api, ex => {
			io.write("\n");
			if(ex != 0) {
				io.setColor("red");
				io.write("X ");
			}
			prompt(app, command, api, cb);
		});
	});
};

module.exports = prompt;
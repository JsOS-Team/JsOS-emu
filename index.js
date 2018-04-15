let app = process.argv[2] || "chrome";

// Run server
let port = require("./server")(require("./server/backend"));
require("opn")(`file://${__dirname}/gui/index.html?${port}`, {app});
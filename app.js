const {StartServer, CreateApp} = require("./server");

let app = CreateApp();
StartServer(app);
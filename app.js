const { text, buffer } = require("stream/consumers");

const { error } = require("console");
const http = require("http");
const route = require("./routs");
const server = http.createServer(route.handler);

server.listen(3000);

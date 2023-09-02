const express = require("express");
const app = express();
const http = require("http");
const routes = require("./routes");
const cors = require("cors");

app.use(cors())
app.use(express.json());
app.use(routes);
const server = http.Server(app);

console.log('conectado na porta 3000')

server.listen(3000);
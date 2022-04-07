const express = require("express");
const app = express();

require("./startup/db")();
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/config")();

const port = process.env.PORT || 3000;
const server = app
  .listen(port, () => console.log(`Listening on port ${port}...`))
  .on("error", () => {
    process.once("SIGUSR2", () => process.kill(process.pid, "SIGUSR2"));
    process.once("SIGINT", () => process.kill(process.pid, "SIGINT"));
    process.once("uncaughtException", () => console.log("UNCAUGHT EXCEPTION"));
  });

module.exports = server;

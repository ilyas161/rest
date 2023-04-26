const pino = require("pino");
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:dd-mm-yyyy hh-mm-ss",
      ignore: "pid,hostname",
    },
  },
});
module.exports = logger;

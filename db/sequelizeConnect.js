const { Sequelize } = require("sequelize");
const logger = require("../logger/logger");

const sequelize = new Sequelize({
  database: process.env.postgres_db,
  username: process.env.postgres_user,
  password: process.env.postgres_pwd,
  dialect: "postgres",
  host: process.env.postgres_host,
  port: process.env.postgres_connection_port,
  logging: (msg) => logger.info(msg),
});

module.exports = sequelize;

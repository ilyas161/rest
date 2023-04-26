const exp = require("express");
const app = exp();
const logger = require("./logger/logger");
require("dotenv").config();
const path = require("path");
const registrationRoute = require("./routes/registration");
const userListRoute = require("./routes/userList");
const changeUserDataRoute = require("./routes/changeUserData");
app.use(exp.json());
app.use("/static", exp.static(path.join(__dirname, "public")));
app.use(exp.urlencoded({ extended: true }));

const sequelize = require("./db/sequelizeConnect");
const User = require("./db/sequelizeStructureDB");

app.use(userListRoute);
app.use(registrationRoute);
app.use(changeUserDataRoute);

const PORT = process.env.port;

app.listen(PORT, async () => {
  logger.info(`app listening port ${PORT}`);
  try {
    await sequelize.authenticate();
    await User.sync();
    logger.info("Connection has been established successfully.");
  } catch (error) {
    logger.error(error);
  }
});

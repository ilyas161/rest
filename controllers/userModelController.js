const logger = require("../logger/logger");
const User = require("../db/sequelizeStructureDB");
const hashController = require("./hashController");
const usersController = require("./usersController");
const { Op } = require("sequelize");

module.exports.addUser = async function (
  username,
  firstname,
  lastname,
  password
) {
  const saltIndividual = await hashController.getSalt();
  if (!saltIndividual) throw new Error("problem with salt");

  let hashedPassword;
  try {
    hashedPassword = await hashController.getHashPassword(
      password,
      saltIndividual + process.env.salt
    );
    if (!hashedPassword) throw new Error("problem with hashing password");
  } catch (error) {
    logger.error(error);
    throw new Error("error with hashing password");
  }

  try {
    const user = await User.create({
      username: username,
      firstname: firstname,
      lastname: lastname,
      password: hashedPassword,
      salt: saltIndividual,
    });
    logger.info(user.toJSON());
    return true;
  } catch (error) {
    logger.error(error);
    throw new Error("falled to add");
  }
};

module.exports.updateUser = async function (
  username,
  firstname,
  lastname,
  password,
  oldUsername
) {
  let salt = await usersController.getUserData(oldUsername, "salt");
  salt = salt[0].dataValues.salt;
  if (!salt) throw new Error("not found this salt");

  let hashPassword;
  try {
    hashPassword = await hashController.getHashPassword(
      password,
      salt + process.env.salt
    );
  } catch (err) {
    logger.error(err);
    throw new Error("problem with getting hash");
  }
  if (!hashPassword) throw new Error("empty hash");

  try {
    let updateResult = await User.update(
      {
        username: username,
        firstname: firstname,
        lastname: lastname,
        password: hashPassword,
      },
      {
        where: {
          username: {
            [Op.eq]: oldUsername,
          },
        },
      }
    );
    if (updateResult == 0) throw new Error("update didn't happen");
    return true;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};

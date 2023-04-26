const logger = require("../logger/logger");
const User = require("../db/sequelizeStructureDB");
const { Op } = require("sequelize");

module.exports.getUserData = async function (username, ...attribute) {
  try {
    const attributeData = await User.findAll({
      attributes: attribute,
      where: {
        username: {
          [Op.eq]: username,
        },
      },
    });
    if (!Object.keys(attributeData).length) {
      throw new Error("There aren't such user");
    }
    return attributeData;
  } catch (err) {
    logger.error(err.message);
    throw new Error();
  }
};

module.exports.getUsersData = async function (parameters) {
  try {
    const attributeData = await User.findAll(parameters);
    if (!Object.keys(attributeData).length) {
      throw new Error("There aren't such users");
    }
    return attributeData;
  } catch (err) {
    logger.error(err.message);
    throw new Error();
  }
};

module.exports.isExist = async function (username) {
  try {
    const attributeData = await User.findAll({
      attributes: ["username"],
      where: {
        username: {
          [Op.eq]: username,
        },
      },
    });
    if (!Object.keys(attributeData).length) {
      return false;
    }
    return true;
  } catch (err) {
    logger.error(err.message);
    throw new Error();
  }
};

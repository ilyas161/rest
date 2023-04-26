const crypto = require("node:crypto");
const logger = require("../logger/logger");

module.exports.getSalt = async function () {
  let salt = "";
  try {
    salt = crypto.randomBytes(16).toString("hex");
  } catch (err) {
    logger.error(err);
    throw new Error("salt not created");
  }
  return salt;
};

module.exports.getHashPassword = async function (password, salt) {
  return new Promise((res, rej) => {
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      err ? rej(err) : res(derivedKey.toString("hex"));
    });
  });
};

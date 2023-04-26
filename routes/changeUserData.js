const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authenticationController");
const usersController = require("../controllers/usersController");
const userModelController = require("../controllers/userModelController");
const { body, validationResult } = require("express-validator");
const logger = require("../logger/logger");

router.put(
  "/v1/users",
  body("username").notEmpty(),
  body("password").notEmpty(),
  body("firstname").notEmpty(),
  body("lastname").notEmpty(),
  body("username").custom(async (value) => {
    const isExistName = await usersController.isExist(value, "username");
    if (isExistName) throw new Error("this username already exists");
  }),
  body("passwordRepeat")
    .notEmpty()
    .custom((value, { req }) => value === req.body.password),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const [username, password] = req.headers.authorization.split("/");
    //const [username, password] = Buffer.from(req.headers.authorization, "base64").toString().split("/"); //if send with base64 coder
    let isAuthorizated;
    try {
      isAuthorizated = await authenticationController.checkAuthentication(
        username,
        password
      );
    } catch (err) {
      logger.error(err);
      return res.status(500).send("have some problems");
    }

    if (!isAuthorizated) {
      return res.status(401).send("password is incorrect");
    }

    try {
      await userModelController.updateUser(
        req.body.username,
        req.body.firstname,
        req.body.lastname,
        req.body.password,
        username
      );
      res.status(200).send("user was update");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
);

module.exports = router;

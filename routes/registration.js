const { Router } = require("express");
const router = Router();
const userModelController = require("../controllers/userModelController");
const usernameController = require("../controllers/usersController");
const { body, validationResult } = require("express-validator");
const logger = require("../logger/logger");

router.post(
  "/v1/registration",
  body("username")
    .notEmpty()
    .custom(async (value) => {
      try {
        const usernameCheckResult = await usernameController.isExist(
          value,
          "username"
        );
        if (usernameCheckResult) {
          throw new Error("username already exist");
        }
      } catch (error) {
        throw new Error("had some problems");
      }
    }),
  body("password").notEmpty(),
  body("firstname").notEmpty(),
  body("lastname").notEmpty(),
  body("passwordRepeat")
    .notEmpty()
    .custom((value, { req }) => value === req.body.password),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let newUser;
    try {
      newUser = await userModelController.addUser(
        req.body.username,
        req.body.firstname,
        req.body.lastname,
        req.body.password
      );
      if (newUser === true)
        return res.status(201).send("user successfuly added");
    } catch (error) {
      logger.error(error);
      res.status(501).send("had some problems");
    }
  }
);

module.exports = router;

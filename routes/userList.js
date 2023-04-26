const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const logger = require("../logger/logger");
const User = require("../db/sequelizeStructureDB");

router.get("/v1/users", async (req, res) => {
  let page = req.query.page;
  let userList = "";
  let pages = 0;
  const usersInPage = 10;
  try {
    pages = await User.count();
  } catch (error) {
    logger.error(error);
    return req.status(501).send("something go wrong");
  }
  if (pages == 0) return res.status(200).send("users not found");
  pages = Math.ceil(pages / usersInPage);
  page = Number(page);
  page--;
  try {
    userList = await usersController.getUsersData({
      limit: usersInPage,
      offset: page * usersInPage,
      attributes: ["username", "firstname", "lastname"],
    });
    const usersDataWithMeta = {
      data: userList,
      meta: {
        UsersInPage: usersInPage,
        CurrentPage: page,
        CountOfPages: pages,
      },
    };
    return res.status(200).send(usersDataWithMeta);
  } catch (error) {
    logger.error(error);
    return res.status(404).send("404 Not Found");
  }
});

module.exports = router;

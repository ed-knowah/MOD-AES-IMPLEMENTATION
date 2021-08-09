const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const isAuth = require("../controllers/auth").isAuth;

router.get("/", userController.getOnboardPage);
router.get("/login", userController.getLoginForm);
router.get("/register", userController.getRegisterForm);
router.get("/home", isAuth, userController.getHomePage);
router.get("/logout", userController.logOut);


router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

module.exports = {
  router,
};

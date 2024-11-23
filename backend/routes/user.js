const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");

router.post("/signup", userController.postAddUser);
router.post("/login", userController.postLoginUser);
router.post("/forgotpassword", userController.postForgotPassword);
router.post("/resetpassword/:id", userController.postResetPassword);
router.get("/contributions", userController.getContributions);
router.get("/favorites", userController.getFavorites);

module.exports = router;
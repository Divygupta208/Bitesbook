const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");
const authenticateUser = require("../middleware/authenticateUser");

router.post("/signup", userController.postAddUser);
router.post("/login", userController.postLoginUser);
// router.post("/forgotpassword", userController.postForgotPassword);
// router.post("/resetpassword/:id", userController.postResetPassword);
router.get("/favorites", authenticateUser, userController.getFavorites);
router.patch("/update/:userId", userController.postUpdateUser);

module.exports = router;

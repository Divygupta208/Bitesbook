const express = require("express");

const router = express.Router();
const adminController = require("../controllers/admin");

router.get("/users", adminController.getAllUsers);
router.patch("/users/:userId", adminController.updateUserRole);
router.delete("/users/:userId", adminController.deleteUser);
router.get("/recipes", adminController.getAllRecipes);
router.delete("/recipes/:recipeId", adminController.deleteRecipes);
router.get("/logs", adminController.getAllLogs);

module.exports = router;

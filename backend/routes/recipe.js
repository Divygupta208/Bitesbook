const express = require("express");

const router = express.Router();
const recipeController = require("../controllers/recipe");

router.post("/create", recipeController.postCreateRecipe);
router.get("/allrecipes", recipeController.getAllRecipes);
router.patch("/update/:recipeId", recipeController.updateRecipe);
router.delete("/delete/:recipeId", recipeController.deleteRecipe);

module.exports = router;

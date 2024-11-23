const Recipe = require("../models/recipe");

const authorizeUser = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to modify this recipe" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authorizeUser;

const { Op } = require("sequelize");
const Recipe = require("../models/recipe");

exports.getSearchedRecipe = async (req, res, next) => {
  const { query } = req.query; // Get search query from request

  console.log(query);

  try {
    // Search in title, ingredients, and category
    const recipes = await Recipe.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { category: { [Op.like]: `%${query}%` } },
          { cookingTime: { [Op.like]: `%${query}%` } },
          { instructions: { [Op.like]: `%${query}%` } },
        ],
      },
      raw: true,
    });

    console.log(recipes);

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes", error });
  }
};

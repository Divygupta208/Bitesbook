const AdminLog = require("../models/adminlog");
const Recipe = require("../models/recipe");
const User = require("../models/user");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

exports.updateUserRole = async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ error: "user not found" });
    }

    user.isAdmin = role === "admin" ? 1 : 0;
    await user.save();

    res.status(200).json({ message: "Role updated successfully", user: user });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

exports.deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
};

exports.getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll();
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching recipes." });
  }
};

exports.deleteRecipes = async (req, res, next) => {
  const { recipeId } = req.params;
  try {
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    await recipe.destroy();
    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the recipe." });
  }
};

exports.getAllLogs = async (req, res, next) => {
  try {
    const logs = await AdminLog.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "An error occurred while fetching logs." });
  }
};

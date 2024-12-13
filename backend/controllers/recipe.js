const { Sequelize } = require("sequelize");
const Follow = require("../models/follow");
const Recipe = require("../models/recipe");
const Review = require("../models/reviews");
const User = require("../models/user");
const AWS = require("aws-sdk");
const FileType = require("file-type");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

const uploadToS3 = async (base64Data, filename) => {
  const buffer = Buffer.from(base64Data.split(",")[1], "base64");

  const fileTypeResult = await FileType.fromBuffer(buffer);

  const contentType = fileTypeResult?.mime || "application/octet-stream";

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ACL: "public-read",
    ContentType: contentType,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading to S3:", err);
        reject(err);
      } else {
        console.log("File uploaded successfully:", data.Location);
        resolve(data.Location);
      }
    });
  });
};

exports.postCreateRecipe = async (req, res, next) => {
  const {
    title,
    description,
    ingredients,
    instructions,
    cookingTime,
    servings,
    difficulty,
    category,
    image,
  } = req.body;

  const userId = req.user.id;

  try {
    let imageUrl = null;

    if (image) {
      const filename = `recipe-${Date.now()}_${userId}`;
      imageUrl = await uploadToS3(image, filename);
    }

    const newRecipe = await Recipe.create({
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      category,
      difficulty,
      image: imageUrl,
      userId,
    });

    res.status(201).json({
      message: "Recipe created successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({
      message: "Failed to create recipe",
      error: error.message,
    });
  }
};
exports.getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "image",
        "category",
        "difficulty",
        "cookingTime",
        "ingredients",
        "instructions",
        "isApproved",
        "userId",
      ],
    });

    const userIds = recipes.map((recipe) => recipe.userId);
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "name", "username", "profilePicture"],
    });

    const followers = await Follow.findAll({
      where: { followerId: req.user.id },
      attributes: ["followedId"],
    });

    const followingUserIds = followers.map((follow) => follow.followedId);

    const reviews = await Review.findAll({
      attributes: [
        "recipeId",
        [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
      ],
      group: ["recipeId"],
    });

    const reviewMap = reviews.reduce((acc, review) => {
      acc[review.recipeId] = review.dataValues.averageRating;
      return acc;
    }, {});

    const formattedRecipes = recipes.map((recipe) => {
      const author = users.find((user) => user.id === recipe.userId);
      const averageRating = reviewMap[recipe.id] || 0;
      const isFollowing = followingUserIds.includes(recipe.userId);

      return {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        difficulty: recipe.difficulty,
        cookingTime: recipe.cookingTime,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        image: recipe.image,
        ratings: parseFloat(averageRating),
        user: {
          id: author.id,
          name: author.name,
          username: author.username,
          profilePicture: author.profilePicture,
          isFollowing: isFollowing,
        },
      };
    });

    res.status(200).json({
      message: "Recipes fetched successfully",
      recipes: formattedRecipes,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch recipes", error: error.message });
  }
};

exports.getContributions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const contributions = await Recipe.findAll({
      where: { userId: userId },
      include: [
        {
          model: Review,
          as: "reviews",
          required: false,
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.fn("AVG", Sequelize.col("reviews.rating")),
            "averageRating",
          ],
        ],
      },
      group: ["Recipe.id"],
      subQuery: false,
    });

    if (!contributions || contributions.length === 0) {
      return res.status(404).json({ message: "No contributions found." });
    }

    const formattedContributions = contributions.map((recipe) => {
      const recipeData = recipe.get({ plain: true });
      return {
        id: recipeData.id,
        title: recipeData.title,
        description: recipeData.description,
        image: recipeData.image,
        cookingTime: recipeData.cookingTime,
        servings: recipeData.servings,
        category: recipeData.category,
        ratings: parseFloat(recipeData.averageRating) || 0,
      };
    });

    res.status(200).json({
      message: "Contributions fetched successfully",
      contributions: formattedContributions,
    });
  } catch (error) {
    console.error("Error fetching contributions:", error);
    res.status(500).json({
      message: "Failed to fetch contributions.",
      error: error.message,
    });
  }
};

exports.updateRecipe = async (req, res, next) => {
  const { recipeId } = req.params;
  const { title, ingredients, instructions, prepTime, servings, category } =
    req.body;

  try {
    const [updated] = await Recipe.update(
      { title, ingredients, instructions, prepTime, servings, category },
      { where: { id: recipeId, userId: req.user.id } }
    );

    if (!updated) {
      return res.status(403).json({
        message:
          "You are not authorized to update this recipe or it does not exist",
      });
    }

    res.status(200).json({ message: "Recipe updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update recipe", error: error.message });
  }
};
exports.deleteRecipe = async (req, res, next) => {
  const { recipeId } = req.params;

  try {
    const deleted = await Recipe.destroy({
      where: { id: recipeId, userId: req.user.id },
    });

    if (!deleted) {
      return res.status(403).json({
        message:
          "You are not authorized to delete this recipe or it does not exist",
      });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete recipe", error: error.message });
  }
};

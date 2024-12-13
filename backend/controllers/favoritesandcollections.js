const Collection = require("../models/collection");
const CollectionRecipe = require("../models/collectionrecipe");
const Favorite = require("../models/favorite");
const Recipe = require("../models/recipe");

exports.postCreateFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params;

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const existingFavorite = await Favorite.findOne({
      where: { userId, recipeId },
    });

    if (existingFavorite) {
      return res
        .status(400)
        .json({ message: "Recipe is already in favorites" });
    }

    await Favorite.create({
      userId,
      recipeId,
    });

    res
      .status(201)
      .json({ message: "Recipe added to favorites successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add recipe to favorites",
      error: error.message,
    });
  }
};

exports.deleteFavoriteRecipe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params;

    const favorite = await Favorite.findOne({
      where: { userId, recipeId },
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite recipe not found." });
    }

    await favorite.destroy();

    res
      .status(200)
      .json({ message: "Recipe removed from favorites successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to remove recipe from favorites",
      error: error.message,
    });
  }
};

exports.createCollection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, recipeIds } = req.body;
    // Create the collection
    const collection = await Collection.create({
      name: name,
      userId: userId,
    });

    if (recipeIds && recipeIds.length > 0) {
      const validRecipes = await Recipe.findAll({
        where: { id: recipeIds },
        attributes: ["id"],
      });

      if (validRecipes.length !== recipeIds.length) {
        return res
          .status(400)
          .json({ message: "Some recipe IDs are invalid or do not exist." });
      }

      const collectionRecipes = validRecipes.map((recipe) => ({
        CollectionId: collection.id,
        recipeId: recipe.id,
      }));
      await CollectionRecipe.bulkCreate(collectionRecipes);
    }

    const associatedRecipeIds = await CollectionRecipe.findAll({
      where: { CollectionId: collection.id },
      attributes: ["recipeId"],
    });

    const recipeIdArray = associatedRecipeIds.map((entry) => entry.recipeId);

    res.status(200).json({
      message: "Collection created successfully.",
      collection: {
        id: collection.id,
        name: collection.name,
        recipes: recipeIdArray,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create collection", error: error.message });
  }
};

exports.getCollections = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const collections = await Collection.findAll({
      where: { userId: userId },
      attributes: ["id", "name"],
    });

    const collectionRecipes = await Promise.all(
      collections.map(async (collection) => {
        const recipes = await CollectionRecipe.findAll({
          where: { CollectionId: collection.id },
          attributes: ["recipeId"],
        });
        return {
          collectionId: collection.id,
          recipeIds: recipes.map((recipe) => recipe.recipeId),
        };
      })
    );

    const formattedCollections = collections.map((collection) => {
      const matchingRecipes = collectionRecipes.find(
        (entry) => entry.collectionId === collection.id
      );
      return {
        id: collection.id,
        name: collection.name,
        recipes: matchingRecipes ? matchingRecipes.recipeIds : [], // Array of recipe IDs
      };
    });

    console.log(formattedCollections);

    res.status(200).json({
      message: "Collections fetched successfully.",
      collections: formattedCollections,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch collections", error: error.message });
  }
};

exports.updateCollection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { collectionId } = req.params;
    const { name, recipeIds } = req.body;

    const collection = await Collection.findOne({
      where: { id: collectionId, userId: userId },
    });

    if (!collection) {
      return res
        .status(404)
        .json({ message: "Collection not found or not authorized." });
    }

    if (name) {
      collection.name = name;
      await collection.save();
    }

    const existingRecipes = await CollectionRecipe.findAll({
      where: { collectionId: collection.id },
      attributes: ["recipeId"],
    });

    const existingRecipeIds = existingRecipes.map((entry) => entry.recipeId);

    const recipesToAdd = recipeIds.filter(
      (recipeId) => !existingRecipeIds.includes(recipeId)
    );
    const recipesToRemove = existingRecipeIds.filter(
      (recipeId) => !recipeIds.includes(recipeId)
    );

    if (recipesToAdd.length > 0) {
      const addPromises = recipesToAdd.map((recipeId) =>
        CollectionRecipe.create({ collectionId: collection.id, recipeId })
      );
      await Promise.all(addPromises);
    }

    if (recipesToRemove.length > 0) {
      const removePromises = recipesToRemove.map((recipeId) =>
        CollectionRecipe.destroy({
          where: { collectionId: collection.id, recipeId },
        })
      );
      await Promise.all(removePromises);
    }

    const updatedCollection = await Collection.findOne({
      where: { id: collection.id },
      attributes: ["id", "name"],
      include: [
        {
          model: CollectionRecipe,
          attributes: ["recipeId"],
        },
      ],
    });

    const formattedCollection = {
      id: updatedCollection.id,
      name: updatedCollection.name,
      recipes: updatedCollection.CollectionRecipes.map(
        (entry) => entry.recipeId
      ),
    };

    res.status(200).json({
      message: "Collection updated successfully.",
      collection: formattedCollection,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update collection.", error: error.message });
  }
};

exports.deleteCollection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { collectionId } = req.params;

    const collection = await Collection.findOne({
      where: {
        id: collectionId,
        userId: userId,
      },
    });

    if (!collection) {
      return res
        .status(404)
        .json({ message: "Collection not found or not authorized." });
    }

    await collection.destroy();

    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to delete collection.", error: err.message });
  }
};

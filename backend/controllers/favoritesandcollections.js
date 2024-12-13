const Collection = require("../models/collection");
const CollectionRecipe = require("../models/collectionrecipe");
const Favorite = require("../models/favorite");
const Recipe = require("../models/recipe");

exports.postCreateFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id; // Logged-in user ID
    const { recipeId } = req.params; // Recipe ID to add to favorites

    // Check if the recipe exists
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user has already favorited the recipe
    const existingFavorite = await Favorite.findOne({
      where: { userId, recipeId },
    });

    if (existingFavorite) {
      return res
        .status(400)
        .json({ message: "Recipe is already in favorites" });
    }

    // Create a new favorite entry in the Favorite table
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
    const userId = req.user.id; // Logged-in user ID
    const { recipeId } = req.params; // Recipe ID to delete from favorites

    // Check if the recipe exists in the user's favorites
    const favorite = await Favorite.findOne({
      where: { userId, recipeId },
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite recipe not found." });
    }

    // Delete the favorite entry
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
    const userId = req.user.id; // Logged-in user ID
    const { name, recipeIds } = req.body; // Collection name and recipe IDs

    // Create the collection
    const collection = await Collection.create({
      name: name,
      userId: userId,
    });

    // Validate and associate recipes with the collection
    if (recipeIds && recipeIds.length > 0) {
      const validRecipes = await Recipe.findAll({
        where: { id: recipeIds },
        attributes: ["id"], // Only fetch IDs for validation
      });

      if (validRecipes.length !== recipeIds.length) {
        return res
          .status(400)
          .json({ message: "Some recipe IDs are invalid or do not exist." });
      }

      // Manually insert entries into CollectionRecipe
      const collectionRecipes = validRecipes.map((recipe) => ({
        CollectionId: collection.id,
        recipeId: recipe.id,
      }));
      await CollectionRecipe.bulkCreate(collectionRecipes);
    }

    // Fetch all recipe IDs associated with the collection
    const associatedRecipeIds = await CollectionRecipe.findAll({
      where: { CollectionId: collection.id },
      attributes: ["recipeId"],
    });

    // Format the response
    const recipeIdArray = associatedRecipeIds.map((entry) => entry.recipeId);

    res.status(200).json({
      message: "Collection created successfully.",
      collection: {
        id: collection.id,
        name: collection.name,
        recipes: recipeIdArray, // Array of recipe IDs
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
    const userId = req.user.id; // Logged-in user ID

    // Fetch all collections for the logged-in user
    const collections = await Collection.findAll({
      where: { userId: userId },
      attributes: ["id", "name"], // Fetch only collection ID and name
    });

    // Fetch associated recipe IDs for each collection
    const collectionRecipes = await Promise.all(
      collections.map(async (collection) => {
        const recipes = await CollectionRecipe.findAll({
          where: { CollectionId: collection.id },
          attributes: ["recipeId"],
        });
        return {
          collectionId: collection.id,
          recipeIds: recipes.map((recipe) => recipe.recipeId), // Extract recipe IDs
        };
      })
    );

    // Transform collections into the desired format
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
    const { collectionId } = req.params; // Collection ID from request parameters
    const { name, recipeIds } = req.body; // Updated name and recipes array

    // Find the collection to update
    const collection = await Collection.findOne({
      where: { id: collectionId, userId: userId },
    });

    if (!collection) {
      return res
        .status(404)
        .json({ message: "Collection not found or not authorized." });
    }

    // Update the collection name if provided
    if (name) {
      collection.name = name;
      await collection.save();
    }

    // Fetch existing recipe IDs for the collection
    const existingRecipes = await CollectionRecipe.findAll({
      where: { collectionId: collection.id },
      attributes: ["recipeId"],
    });

    const existingRecipeIds = existingRecipes.map((entry) => entry.recipeId);

    // Determine recipes to add and remove
    const recipesToAdd = recipeIds.filter(
      (recipeId) => !existingRecipeIds.includes(recipeId)
    );
    const recipesToRemove = existingRecipeIds.filter(
      (recipeId) => !recipeIds.includes(recipeId)
    );

    // Add new recipes
    if (recipesToAdd.length > 0) {
      const addPromises = recipesToAdd.map((recipeId) =>
        CollectionRecipe.create({ collectionId: collection.id, recipeId })
      );
      await Promise.all(addPromises);
    }

    // Remove recipes no longer in the collection
    if (recipesToRemove.length > 0) {
      const removePromises = recipesToRemove.map((recipeId) =>
        CollectionRecipe.destroy({
          where: { collectionId: collection.id, recipeId },
        })
      );
      await Promise.all(removePromises);
    }

    // Fetch the updated collection with recipes
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

    // Format the response
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

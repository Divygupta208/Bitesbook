const express = require("express");

const router = express.Router();
const favsandcollsController = require("../controllers/favoritesandcollections");

router.post(
  "/add-favorites/:recipeId",
  favsandcollsController.postCreateFavorites
);
router.delete(
  "/favorites/:recipeId",
  favsandcollsController.deleteFavoriteRecipe
);
router.post("/collections/create", favsandcollsController.createCollection);
router.get("/collections", favsandcollsController.getCollections);
router.put(
  "/collections/:collectionId",
  favsandcollsController.updateCollection
);
router.delete(
  "/collections/:collectionId",
  favsandcollsController.deleteCollection
);

module.exports = router;

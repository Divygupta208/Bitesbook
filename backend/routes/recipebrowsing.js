const express = require("express");

const router = express.Router();
const searchController = require("../controllers/search");

router.get("/recipes", searchController.getSearchedRecipe); //includeing query params ?category , ? diff , ? preptime

module.exports = router;

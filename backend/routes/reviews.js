const express = require("express");

const router = express.Router();
const reviewsController = require("../controllers/reviews");

router.post("/addreview", reviewsController.addReview);
router.put("/update/:reviewId", reviewsController.updateReview);
router.delete("/delete/:reviewId", reviewsController.deleteReview);
router.get("/recipe/:recipeId", reviewsController.getRecipeReviews);

module.exports = router;

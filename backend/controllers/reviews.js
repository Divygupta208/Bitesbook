const Review = require("../models/reviews");
const User = require("../models/user");

exports.addReview = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Create a new review
    const review = await Review.create({
      rating,
      comment,
      userId,
      recipeId,
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add review",
      error: error.message,
    });
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Fetch the review
    const review = await Review.findOne({
      where: { id: reviewId, userId },
    });

    if (!review) {
      return res.status(403).json({
        message: "You can only update your own reviews",
      });
    }

    // Update the review
    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    res.status(200).json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update review",
      error: error.message,
    });
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Fetch the review
    const review = await Review.findOne({
      where: { id: reviewId, userId },
    });

    if (!review) {
      return res.status(403).json({
        message: "You can only delete your own reviews",
      });
    }

    // Delete the review
    await review.destroy();

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

exports.getRecipeReviews = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    // Fetch all reviews for the specified recipe
    const reviews = await Review.findAll({
      where: { recipeId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "username", "profilePicture"],
        },
      ],
    });

    // Format the reviews to include user information
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: review.user
        ? {
            id: review.user.id,
            name: review.user.name,
            username: review.user.username,
            profilePicture: review.user.profilePicture,
          }
        : null, // Handle cases where user information might be missing
    }));

    console.log("formattedReviews", formattedReviews);

    // Send a successful response
    res.status(200).json({
      message: "Reviews fetched successfully",
      reviews: formattedReviews,
    });
  } catch (error) {
    console.error(error);
    // Send an error response
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

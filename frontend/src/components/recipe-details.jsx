import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { recipeAction } from "../store/recipe-slice";

const RecipeDetails = () => {
  const { recipeid } = useParams();
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const commentRef = useRef();
  const [menu, setMenu] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions((prev) => !prev);
  };

  useEffect(() => {
    dispatch(recipeAction.fetchRecipes());
    dispatch(recipeAction.fetchFavorites());
    handleFetchReviews();
  }, [dispatch]);

  const handleFetchReviews = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://my-api.zapto.org/bitesbook/review/recipe/${recipeid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitReview = async () => {
    const comment = commentRef.current.value.trim();
    if (!rating && !comment) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://my-api.zapto.org/bitesbook/review/addreview/${recipeid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const newReview = await response.json();
      await handleFetchReviews();
      setRating(0); // Reset rating
      commentRef.current.value = ""; // Clear comment field
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddFavorite = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://my-api.zapto.org/bitesbook/manage/add-favorites/${recipeid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add favorite");
      }

      dispatch(recipeAction.fetchRecipes());
      dispatch(recipeAction.fetchFavorites());
    } catch (error) {
      console.log(error);
    }
  };

  const recipes = useSelector((state) => state.recipes.recipes);
  const favorites = useSelector((state) => state.recipes.favorites);
  const isFavorite = favorites?.favoriteRecipeIds?.includes(parseInt(recipeid));

  const recipe = recipes.find((recipe) => recipe.id === parseInt(recipeid));

  const { instructions, ingredients } = recipe || {};

  if (!recipe) {
    return <div className="text-center mt-20">Recipe not found</div>;
  }

  const averageRating = recipe.ratings;

  return (
    <motion.div
      className="min-h-screen bg-gray-100 flex flex-col lg:flex-row p-6 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-lg shadow-lg lg:w-1/2 mt-10">
        <div className="p-4 border-b">
          <Link
            to="/home"
            className="text-gray-700 flex items-center hover:text-black"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </Link>
          <div className="flex items-center justify-between mt-4">
            <div>
              <img
                src={recipe.user.profilePicture}
                className="w-10 h-10 rounded-full mr-3"
              />
              <span className="font-semibold">{recipe.user.name}</span>
            </div>
            <div className="">
              <BsThreeDotsVertical
                onClick={() => {
                  setMenu(!menu);
                }}
              />
              {menu && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border-2 border-opacity-50 border-slate-400 rounded-xl absolute top-40 w-40 h-36 -mx-20 mt-3"
                >
                  {!isFavorite && (
                    <button
                      onClick={() => handleAddFavorite()}
                      className="text-black text-sm font-semibold border-2 border-black/30 w-full hover:bg-gray-400 rounded-lg mt-5"
                    >
                      ⭐Favorite
                    </button>
                  )}
                  {isFavorite && (
                    <button
                      onClick={() => handleAddFavorite()}
                      className="text-black text-sm font-semibold border-2 border-black/30 w-full hover:bg-gray-400 rounded-lg mt-5"
                    >
                      Remove As Favorite
                    </button>
                  )}
                  <button className="text-black text-sm font-semibold border-2 border-black/30 w-full hover:bg-gray-400 rounded-lg mt-2">
                    📝Save
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        <div>
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-72 object-cover rounded-t-lg"
          />
        </div>
        <div className="p-4">
          <h1 className="text-2xl font-bold">{recipe.title}</h1>
          <p className="text-gray-600 mt-2">{recipe.description}</p>
          <div className="flex items-center mt-4 gap-5">
            {Array.from({ length: 5 }, (_, index) => (
              <FaStar
                key={index}
                size={24}
                className={
                  index + 1 <= Math.round(averageRating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }
              />
            ))}
            <span className=" text-gray-600">({averageRating.toFixed(1)})</span>

            <p className="font-bold">{recipe.difficulty}</p>
            <p className=" ">{recipe.cookingTime}(min)</p>
            <button
              onClick={toggleInstructions}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {showInstructions ? "Hide Instructions" : "Show Instructions"}
            </button>
          </div>
        </div>
      </div>

      <div>
        {showInstructions && (
          <div className="mt-20">
            <h2 className="text-xl font-semibold">Instructions:</h2>
            <p className="text-gray-600 whitespace-pre-wrap mt-2">
              {instructions?.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>

            <h2 className="text-xl font-semibold mt-4">Ingredients:</h2>
            <ul className="list-disc ml-5 text-gray-600">
              {ingredients?.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg lg:w-1/2 mt-20">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Comments</h2>
          <div className="mt-4 space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex gap-2">
                  <img
                    src={review.user?.profilePicture}
                    alt={review.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-semibold">{review.user.name}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <div className="flex items-center mt-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar
                      key={i}
                      size={20}
                      className={
                        i + 1 <= review.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="focus:outline-none"
                >
                  <FaStar
                    size={24}
                    className={
                      star <= (hover || rating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  />
                </motion.button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a comment..."
              ref={commentRef}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 mt-4"
            />
            <button
              onClick={handleSubmitReview}
              className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeDetails;

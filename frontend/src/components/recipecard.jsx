import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { recipeAction } from "../store/recipe-slice";

const RecipeCard = ({ recipe }) => {
  const dispatch = useDispatch();
  const isFollowing = recipe.user.isFollowing;

  const handleFollow = async (userId) => {
    const token = localStorage.getItem("token");

    const type = isFollowing ? "unfollow" : "follow";

    try {
      const response = await fetch(
        `https://my-api.zapto.org/bitesbook/social/${type}/${userId}`,
        {
          method: isFollowing ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(recipeAction.fetchRecipes());
      }
    } catch (e) {}
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xl shadow-black/60"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img
            src={recipe.user.profilePicture}
            alt={`${recipe.user.name}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold">{recipe.user.name}</p>
            <p className="text-xs text-gray-500">{recipe.user.username}</p>
          </div>
        </div>

        {isFollowing ? (
          <button
            className="bg-gray-400 hover:bg-blue-600 text-white text-xs font-medium py-1 px-3 rounded"
            onClick={() => handleFollow(recipe.user.id)}
          >
            unfollow
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-3 rounded"
            onClick={() => handleFollow(recipe.user.id)}
          >
            Follow
          </button>
        )}
      </div>

      <img
        src={recipe.image}
        alt={recipe.title}
        className="h-56 w-full object-cover"
      />

      <div className="p-4 space-y-3">
        <h2 className="text-base font-semibold">{recipe.title}</h2>
        <p className="text-sm text-gray-600">
          {recipe.description.slice(0, 100)}...
        </p>
        <p className="text-sm text-gray-600">
          cooking difficulty : {recipe.difficulty}
        </p>
        <p className="text-sm text-gray-600">
          cooking time : {recipe.cookingTime}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">&#9733;</span>
            <p className="text-sm font-medium">{recipe.ratings.toFixed(1)}</p>
          </div>
          <Link
            to={`/home/recipe/${recipe.id}`}
            className="text-blue-500 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;

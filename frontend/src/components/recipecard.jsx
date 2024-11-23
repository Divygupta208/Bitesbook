import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RecipeCard = ({ recipe }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white shadow-md rounded-lg overflow-hidden"
    >
      <img
        src={recipe.image}
        alt={recipe.title}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{recipe.title}</h2>
        <p className="text-gray-600 text-sm mb-4">
          {recipe.description.slice(0, 100)}...
        </p>
        <Link
          to={`/recipe/${recipe.id}`}
          className="text-blue-500 text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default RecipeCard;

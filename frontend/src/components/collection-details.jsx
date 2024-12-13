import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { recipeAction } from "../store/recipe-slice";

const CollectionDetails = () => {
  const { collectionId } = useParams();
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes.recipes);
  const collections = useSelector((state) => state.recipes.collections);
  const collection = collections.find((collect) => collect.id == collectionId);

  console.log(collection);
  useEffect(() => {
    dispatch(recipeAction.fetchRecipes());
    dispatch(recipeAction.fetchCollections());
  }, [collectionId]);

  if (!collection) {
    return <p>Loading...</p>;
  }

  const collectionRecipes = recipes.filter((recipe) =>
    collection?.recipes?.includes(recipe.id)
  );

  return (
    <div className="p-6 bg-gray-300 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-4">{collection.name}</h1>
        <p className="text-gray-600 mb-6">
          {collectionRecipes.length} recipe(s) in this collection.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectionRecipes.map((recipe) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg"
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-40 object-cover rounded-t-lg mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">{recipe.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{recipe.description}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              View Recipe
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CollectionDetails;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AddRecipeForm from "./add-recipe";
import recipeSlice, { recipeAction } from "../store/recipe-slice";
import { FaEdit, FaOpencart, FaTrash } from "react-icons/fa";

const MyRecipes = () => {
  const dispatch = useDispatch();
  const [edit, setIsEditing] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const recipes = useSelector((state) => state.recipes.myrecipe);
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const addnewRecipe = () => {
    setIsEditing(false);
    toggleModal();
  };

  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const { name, username } = userData;

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/recipe/delete/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(recipeAction.deleteRecipe(recipeId));
        dispatch(recipeAction.fetchMyRecipes());
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleEdit = async (recipe) => {
    setIsEditing(true);
    setCurrentRecipe(recipe);
    toggleModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-8 lg:px-16 py-6">
      <div className="flex flex-row gap-5 mb-5 text-white font-semibold">
        <Link
          to={"/Home/myrecipes/favorites"}
          className="mt-16 p-3 bg-indigo-500 rounded-lg"
        >
          Favorites
        </Link>
        <Link
          to={"/Home/myrecipes/collections"}
          className="mt-16 p-3 bg-indigo-500 rounded-lg"
        >
          Collections
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes &&
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white shadow-2xl rounded-lg p-4 flex flex-col items-center"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-40 object-cover rounded-lg"
              />
              <div className="mt-3 w-full">
                <h3 className="text-lg font-bold text-gray-800">
                  {recipe.title}
                </h3>

                <p className="text-sm text-gray-600">{recipe.description}</p>
              </div>

              <div className="flex items-center mt-4 w-full">
                <img
                  src={userData.profilePicture || "/default-avatar.png"} // Replace with actual avatar or a default image
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />

                <div className="ml-2">
                  <p className="text-sm font-semibold">{name || "Unknown"}</p>
                  <p className="text-xs text-gray-600">{username || "user"}</p>
                </div>
                <div className="flex  justify-end gap-5 ml-40 align-middle ">
                  <button className="" onClick={() => handleEdit(recipe)}>
                    <FaEdit />
                  </button>
                  <button
                    className=""
                    onClick={() => handleDeleteRecipe(recipe.id)}
                  >
                    <FaTrash />
                  </button>
                  <Link
                    to={`/home/recipe/${recipe.id}`}
                    className="text-blue-500"
                  >
                    details
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>

      <button
        className="fixed top-20 right-20 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300 "
        onClick={addnewRecipe}
      >
        Add New Recipe
      </button>

      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 p-6 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-100  hover:bg-black"
              onClick={toggleModal}
            >
              X
            </button>
            <AddRecipeForm edit={edit} currentRecipe={currentRecipe} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MyRecipes;

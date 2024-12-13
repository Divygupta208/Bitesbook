import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { fetchRecipes } from "../store/recipeSlice";
import RecipeList from "./recipelist";
import { recipeAction } from "../store/recipe-slice";
import { jwtDecode } from "jwt-decode";

const RecipePosts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(recipeAction.fetchRecipes());
  }, [dispatch]);

  const recipes = useSelector((state) => state.recipes.recipes);

  if (!recipes) {
    return <div className="text-center bg-black mt-40">Loading recipes...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 lg:px-16 py-6">
      <h1 className="text-2xl font-semibold mb-6">Recipe Posts</h1>
      <RecipeList recipes={recipes} />
    </div>
  );
};

export default RecipePosts;

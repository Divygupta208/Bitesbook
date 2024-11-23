import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { fetchRecipes } from "../store/recipeSlice";
import RecipeList from "./recipelist";

const recipes = {};

const RecipePosts = () => {
  const dispatch = useDispatch();
  //   const { recipes, loading, error } = useSelector((state) => state.recipe);

  //   useEffect(() => {
  //     dispatch(fetchRecipes()); // Fetch recipes when the component mounts
  //   }, [dispatch]);

  //   if (loading)
  //     return <div className="text-center py-4">Loading recipes...</div>;
  //   if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 lg:px-16 py-6">
      <h1 className="text-2xl font-semibold mb-6">Recipe Posts</h1>
      <RecipeList recipes={recipes} />
    </div>
  );
};

export default RecipePosts;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { recipeAction } from "../store/recipe-slice";
import { FaTrash } from "react-icons/fa";

const FavoriteRecipes = () => {
  const dispatch = useDispatch();
  // Fetch recipes and favorites from the Redux store

  useEffect(() => {
    dispatch(recipeAction.fetchRecipes());
    dispatch(recipeAction.fetchFavorites());
  }, [dispatch]);

  const recipes = useSelector((state) => state.recipes.recipes);
  const fav = useSelector((state) => state.recipes.favorites);

  // Get favorite recipes
  const favoriteRecipes = recipes.filter((recipe) =>
    fav?.favoriteRecipeIds?.includes(recipe.id)
  );

  const removeFavorite = async (recipeId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://my-api.zapto.org/bitesbook/manage/favorites/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add favorite");
      }

      dispatch(recipeAction.fetchFavorites());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-4 mt-20 ">Favorite Recipes</h1>
        <Link to={"/Home/myrecipes"}>↩ Back</Link>
      </div>
      {favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="border rounded-lg shadow-md p-4 space-y-2"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="rounded-md w-full h-40 object-cover"
              />
              <h2 className="text-lg font-semibold">{recipe.title}</h2>
              <p className="text-gray-600">{recipe.description}</p>
              <p className="text-sm text-gray-500">Rating: {recipe.ratings}</p>
              <button onClick={() => removeFavorite(recipe.id)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No favorite recipes yet. Start adding some!</p>
      )}
    </div>
  );
};

export default FavoriteRecipes;

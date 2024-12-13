import React from "react";
import RecipeCard from "./recipecard";
import { jwtDecode } from "jwt-decode";

const RecipeList = ({ recipes }) => {
  const token = localStorage.getItem("token");

  const user = jwtDecode(token);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map(
        (recipe) =>
          recipe.user.id !== user.userId && (
            <RecipeCard key={recipe.id} recipe={recipe} />
          )
      )}
    </div>
  );
};

export default RecipeList;

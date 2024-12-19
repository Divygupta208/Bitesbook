import React, { useEffect, useState } from "react";

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(
        "https://my-api.zapto.org/bitesbook/admin/recipes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(
        `https://my-api.zapto.org/bitesbook/admin/recipes/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      fetchRecipes(); // Refresh recipe list
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Recipes</h2>
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes?.map((recipe) => (
            <tr key={recipe.id} className="border-t">
              <td className="py-2 px-4">{recipe.title}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleDeleteRecipe(recipe.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipeManagement;

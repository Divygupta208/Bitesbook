import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { recipeAction } from "../store/recipe-slice";
import { FaEdit, FaTrash } from "react-icons/fa";

const CollectionsPage = () => {
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes.recipes); // All recipes
  const favs = useSelector((state) => state.recipes.favorites); // Favorite recipe IDs
  const collections = useSelector((state) => state.recipes.collections); // All collections
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  // Fetch collections, recipes, and favorites on page load
  useEffect(() => {
    dispatch(recipeAction.fetchCollections());
    dispatch(recipeAction.fetchRecipes());
    dispatch(recipeAction.fetchFavorites());
  }, [dispatch]);

  const favoriteRecipes = useMemo(() => {
    return recipes.filter((recipe) =>
      favs?.favoriteRecipeIds?.includes(recipe.id)
    );
  }, [recipes, favs]);

  const handleAddCollection = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (newCollectionName.trim() === "") {
      alert("Collection name cannot be empty!");
      return;
    }

    const newCollection = {
      name: newCollectionName,
      recipeIds: selectedRecipes,
    };

    const url = isEditing
      ? `https://my-api.zapto.org/bitesbook/manage/collections/${selectedCollection.id}`
      : "https://my-api.zapto.org/bitesbook/manage/collections/create";

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCollection),
      });

      if (response.ok) {
        setNewCollectionName("");
        setSelectedRecipes([]);
        setShowForm(false);
        setIsEditing(false);
        dispatch(recipeAction.fetchCollections());
      } else {
        console.error("Failed to save collection.");
      }
    } catch (error) {
      console.error("Error saving collection:", error);
    }
  };

  const handleRecipeSelection = (recipeId) => {
    setSelectedRecipes((prevSelected) =>
      prevSelected.includes(recipeId)
        ? prevSelected.filter((id) => id !== recipeId)
        : [...prevSelected, recipeId]
    );
  };

  const handleEditColl = (collection) => {
    setIsEditing(true);
    setSelectedCollection(collection);
    setNewCollectionName(collection.name);
    setSelectedRecipes(collection.recipes);
    setShowForm(true);
  };

  const handleDelete = async (collectionId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://my-api.zapto.org/bitesbook/manage/collections/${collectionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        dispatch(recipeAction.fetchCollections());
      } else {
        console.error("Failed to delete collection.");
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Collections</h1>
      <button
        onClick={() => {
          setShowForm(true);
          setIsEditing(false);
          setNewCollectionName("");
          setSelectedRecipes([]);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        Make New Collection
      </button>
      {showForm && (
        <form
          onSubmit={handleAddCollection}
          className="bg-white shadow-md rounded-lg p-4 mb-6 max-w-md"
        >
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? "Edit Collection" : "Create New Collection"}
          </h2>
          <div className="mb-4">
            <label
              htmlFor="collectionName"
              className="block text-sm font-medium"
            >
              Collection Name
            </label>
            <input
              type="text"
              id="collectionName"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded"
              placeholder="Enter collection name"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">
              Select Favorite Recipes:
            </h3>
            {favoriteRecipes?.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {favoriteRecipes.map((recipe) => (
                  <label
                    key={recipe.id}
                    className="flex items-center space-x-2 bg-gray-50 border p-2 rounded cursor-pointer hover:shadow-sm"
                  >
                    <input
                      type="checkbox"
                      value={recipe.id}
                      checked={selectedRecipes.includes(recipe.id)}
                      onChange={() => handleRecipeSelection(recipe.id)}
                    />
                    <span>{recipe.title}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No favorite recipes available.</p>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {isEditing ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <div key={collection.id}>
            <Link
              to={`/Home/myrecipes/collections/${collection.id}`}
              className="block"
            >
              <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-lg font-semibold mb-2">
                  {collection.name}
                </h2>
                <p className="text-gray-500 text-sm">
                  {collection.recipes.length} recipes
                </p>
              </div>
            </Link>
            <div className="flex justify-between mt-2">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEditColl(collection)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(collection.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;

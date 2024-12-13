import { createSlice } from "@reduxjs/toolkit";

const fetchRecipes = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/recipe/allrecipes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();

      dispatch(recipeSlice.actions.setRecipes(data.recipes));
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };
};

const fetchMyRecipes = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3000/recipe/contributions",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch my recipes");
      }
      const data = await response.json();

      dispatch(recipeSlice.actions.setMyRecipes(data.contributions));
    } catch (error) {
      console.error("Error fetching my recipes:", error);
    }
  };
};

const fetchCollections = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/manage/collections", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }
      const data = await response.json();

      dispatch(recipeSlice.actions.setCollections(data.collections));
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };
};

const fetchFavorites = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/user/favorites", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }
      const data = await response.json();
      dispatch(recipeSlice.actions.setFavorites(data));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };
};

const recipeSlice = createSlice({
  name: "recipes",
  initialState: {
    recipes: [],
    myrecipe: [],
    collections: [],
    favorites: [],
  },
  reducers: {
    // Add a recipe
    addRecipe: (state, action) => {
      state.recipes.push(action.payload);
    },
    // Delete a recipe by ID
    deleteRecipe: (state, action) => {
      state.recipes = state.recipes.filter(
        (recipe) => recipe.id !== action.payload
      );
    },
    // Update a recipe by ID
    updateRecipe: (state, action) => {
      const index = state.recipes.findIndex(
        (recipe) => recipe.id === action.payload.id
      );
      if (index !== -1) {
        state.recipes[index] = { ...state.recipes[index], ...action.payload };
      }
    },
    // Set all recipes
    setRecipes: (state, action) => {
      state.recipes = action.payload;
    },
    // Set myRecipes
    setMyRecipes: (state, action) => {
      state.myrecipe = action.payload;
    },
    // Add to myRecipes
    addMyRecipe: (state, action) => {
      state.myrecipe.push(action.payload);
    },
    // Remove from myRecipes
    removeMyRecipe: (state, action) => {
      state.myrecipe = state.myrecipe.filter(
        (recipe) => recipe.id !== action.payload
      );
    },
    // Set collections
    setCollections: (state, action) => {
      state.collections = action.payload;
    },
    // Add to collections
    addCollection: (state, action) => {
      state.collections.push(action.payload);
    },
    // Set favorites
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    // Add to favorites
    addFavorite: (state, action) => {
      if (!state.favorites.some((recipe) => recipe.id === action.payload.id)) {
        state.favorites.push(action.payload);
      }
    },
    // Remove from favorites
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (recipe) => recipe.id !== action.payload
      );
    },
  },
});

export const recipeAction = {
  ...recipeSlice.actions,
  fetchRecipes,
  fetchMyRecipes,
  fetchCollections,
  fetchFavorites,
};

export default recipeSlice;

import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import recipeSlice from "./recipe-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    recipes: recipeSlice.reducer,
  },
});

export const authAction = authSlice.actions;

export default store;

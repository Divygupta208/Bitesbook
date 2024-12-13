import React, { useEffect } from "react";
import RecipePosts from "../components/recipeposts";
import MyRecipes from "../components/myrecipe";
import { useDispatch } from "react-redux";
import { recipeAction } from "../store/recipe-slice";

const MyRecipe = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(recipeAction.fetchMyRecipes());
  }, []);

  return (
    <>
      <MyRecipes />
    </>
  );
};

export default MyRecipe;

import React, { useEffect } from "react";
import RecipePosts from "../components/recipeposts";
import { recipeAction } from "../store/recipe-slice";
import { useDispatch } from "react-redux";

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(recipeAction.fetchRecipes());
  }, [dispatch]);

  return (
    <>
      <RecipePosts />
    </>
  );
};

export default HomePage;

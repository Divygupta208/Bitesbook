import { Route, Router, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Layout from "./pages/layout";
import HomePage from "./pages/homepage";
import MyRecipe from "./pages/myrecipe";
import RecipeDetails from "./components/recipe-details";
import FavoriteRecipes from "./components/favorite";
import CollectionsPage from "./components/collections";
import CollectionDetails from "./components/collection-details";
import AdminDashboard from "./components/admin-dashboard";
import UserFeed from "./components/userfeed";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/Home" element={<Layout />}>
          <Route path="" element={<HomePage />} />
          <Route path="myrecipes" element={<MyRecipe />} />
          <Route path="myrecipes/favorites" element={<FavoriteRecipes />} />
          <Route path="myrecipes/collections" element={<CollectionsPage />} />
          <Route
            path="myrecipes/collections/:collectionId"
            element={<CollectionDetails />}
          />
          <Route path="recipe/:recipeid" element={<RecipeDetails />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="feed" element={<UserFeed />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

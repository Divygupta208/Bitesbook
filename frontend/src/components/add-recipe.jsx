import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { recipeAction } from "../store/recipe-slice";

const AddRecipeForm = ({ edit, currentRecipe }) => {
  const dispatch = useDispatch();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const ingredientsRef = useRef();
  const instructionsRef = useRef();
  const cookingTimeRef = useRef();
  const servingsRef = useRef();
  const difficultyRef = useRef();
  const categoryRef = useRef();
  const imageRef = useRef();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (edit && currentRecipe) {
      titleRef.current.value = currentRecipe.title || "";
      descriptionRef.current.value = currentRecipe.description || "";
      ingredientsRef.current.value =
        (currentRecipe.ingredients && currentRecipe.ingredients.join(", ")) ||
        "";
      instructionsRef.current.value = currentRecipe.instructions || "";
      cookingTimeRef.current.value = currentRecipe.cookingTime || "";
      servingsRef.current.value = currentRecipe.servings || "";
      difficultyRef.current.value = currentRecipe.difficulty || "";
      categoryRef.current.value = currentRecipe.category || "";
      imageRef.current.value = currentRecipe.image || "";
    }
  }, [edit, currentRecipe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Calling");
    const title = titleRef.current.value.trim();
    const description = descriptionRef.current.value.trim();
    const ingredients = ingredientsRef.current.value.trim();
    const instructions = instructionsRef.current.value.trim();
    const cookingTime = cookingTimeRef.current.value.trim();
    const servings = servingsRef.current.value.trim();
    const difficulty = difficultyRef.current.value;
    const category = categoryRef.current.value.trim();
    const image = previewImage;

    if (
      !title ||
      !description ||
      !ingredients ||
      !instructions ||
      !cookingTime ||
      !servings ||
      !difficulty ||
      !category
    ) {
      setError("All fields except 'image' are required.");
      return;
    }

    const formattedData = {
      title,
      cookingTime: parseInt(cookingTime, 10),
      description,
      ingredients: ingredients.split(",").map((item) => item.trim()),
      instructions,
      servings: parseInt(servings, 10),
      difficulty,
      category,
      image,
    };

    try {
      const token = localStorage.getItem("token");
      const endpoint = edit
        ? `http://localhost:3000/recipe/update/${currentRecipe.id}`
        : "http://localhost:3000/recipe/create";

      const method = edit ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save recipe");
      }

      const result = await response.json();
      console.log("Recipe saved successfully:", result);

      dispatch(recipeAction.fetchMyRecipes());
      setError("");
    } catch (error) {
      console.error("Error saving recipe:", error);
      setError(error.message);
    }
  };

  return (
    <div className="px-4 bg-gray-100  flex items-center justify-center">
      <div className="w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-md p-6 md:p-10 overflow-scroll">
        <h1 className="text-3xl font-bold mb-6 text-center text-red-800">
          {edit ? "Edit Recipe" : "Add a New Recipe"}
        </h1>
        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                ref={titleRef}
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter recipe title"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Category
              </label>
              <input
                type="text"
                ref={categoryRef}
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="e.g., Dessert"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              ref={descriptionRef}
              className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter recipe description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Ingredients (comma-separated)
              </label>
              <input
                type="text"
                ref={ingredientsRef}
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="e.g., Eggs, Milk, Sugar"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Cooking Time (minutes)
              </label>
              <input
                type="number"
                ref={cookingTimeRef}
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="e.g., 30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Servings
              </label>
              <input
                type="number"
                ref={servingsRef}
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="e.g., 4"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Difficulty
              </label>
              <select
                ref={difficultyRef}
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="" disabled>
                  Select difficulty
                </option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Instructions
            </label>
            <textarea
              ref={instructionsRef}
              className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Step-by-step instructions"
            />
          </div>

          <div>
            <img src={previewImage || ""} width={40} height={40} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={imageRef}
              className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter image URL"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          >
            {edit ? "Update Recipe" : "Submit Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeForm;

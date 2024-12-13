import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SearchResults = ({ searchResults }) => {
  console.log(searchResults);

  const [filteredResults, setFilteredResults] = useState(searchResults);
  const [prepTime, setPrepTime] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const filterResults = () => {
    let results = [...searchResults];

    if (prepTime) {
      results = results.filter((recipe) => recipe.prepTime === prepTime);
    }
    if (dietaryPreference) {
      results = results.filter(
        (recipe) => recipe.dietaryPreference === dietaryPreference
      );
    }
    if (difficulty) {
      results = results.filter((recipe) => recipe.difficulty === difficulty);
    }

    setFilteredResults(results);
  };

  // Handle dropdown change
  const handlePrepTimeChange = (e) => {
    setPrepTime(e.target.value);
  };

  const handleDietaryPreferenceChange = (e) => {
    setDietaryPreference(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  // Re-filter whenever the filters change
  useEffect(() => {
    filterResults();
  }, [prepTime, dietaryPreference, difficulty, searchResults]);

  return (
    <div className="absolute py-8 px-4 sm:px-6 lg:px-8 bg-black top-40 text-black">
      {/* Filter Bar */}
      <div className="flex space-x-4 mb-6">
        <select
          onChange={handlePrepTimeChange}
          value={prepTime}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Prep Time</option>
          <option value="10">10 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">60 minutes</option>
        </select>

        <select
          onChange={handleDietaryPreferenceChange}
          value={dietaryPreference}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Dietary Preference</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="non-vegetarian">Non-veg</option>
          <option value="gluten-free">Gluten-free</option>
        </select>

        <select
          onChange={handleDifficultyChange}
          value={difficulty}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Difficulty Level</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Displaying Filtered Results */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } },
        }}
      >
        {filteredResults.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No recipes found</p>
        ) : (
          filteredResults.map((recipe) => (
            <motion.div
              key={recipe.id}
              className="bg-white p-2 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {recipe.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{recipe.ingredients}</p>
              <p className="text-sm text-gray-500">{recipe.category}</p>
              <div className="mt-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Link to={`/home/recipe/${recipe.id}`}>View Recipe</Link>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default SearchResults;

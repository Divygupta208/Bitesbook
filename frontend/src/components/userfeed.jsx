import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const UserFeed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/social/feed", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token here
          },
        });
        setFeed(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user feed:", error);
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Feed</h1>
      {feed.length === 0 ? (
        <p className="text-gray-600">
          No recent activities from people you follow.
        </p>
      ) : (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {feed.map((recipe) => (
            <motion.div
              key={recipe.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center bg-white shadow-md rounded-lg p-4"
            >
              <img
                src={recipe.User.profilePicture || "/default-avatar.png"}
                alt={`${recipe.User.name}'s profile`}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {recipe.User.name}
                </h4>
                <p className="text-gray-600">
                  Added a new recipe:{" "}
                  <span className="font-medium">{recipe.title}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(recipe.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default UserFeed;

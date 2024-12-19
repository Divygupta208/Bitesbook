import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { recipeAction } from "../store/recipe-slice";

const Followed = ({ type, userId, onClose }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const title = type === "followers" ? "followers" : "following";

  useEffect(() => {
    fetchFollowData();
  }, []);

  const fetchFollowData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://my-api.zapto.org/bitesbook/social/${type}/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setUsers(data.followers || data.following);
    } catch (error) {
      console.error("Error fetching follow data:", error);
    }
  };

  const handleUnfollow = async (user) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://my-api.zapto.org/bitesbook/social/unfollow/${user}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      dispatch(recipeAction.fetchRecipes());
      fetchFollowData();
    } catch (e) {}
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <button
        onClick={onClose}
        className="text-gray-600 hover:text-gray-900 focus:outline-none mb-4"
      >
        ✕ Close
      </button>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="flex items-center space-x-4">
            <img
              src={user.profilePicture || "https://via.placeholder.com/50"}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-500">{user.username}</p>
            </div>
            <button onClick={() => handleUnfollow(user.id)}>unfollow</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Followed;

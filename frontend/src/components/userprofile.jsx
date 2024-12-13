import React, { useState } from "react";
import { motion } from "framer-motion";
import Followed from "./followed";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const UserProfileSidebar = ({ isOpen, onClose }) => {
  const userId = jwtDecode(localStorage.getItem("token")).userId;
  const user = useSelector((state) => state.auth.userData);
  const [isEditing, setIsEditing] = useState(false);
  const [isFollowViewOpen, setIsFollowViewOpen] = useState(false);
  const [followType, setFollowType] = useState("followers");
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio || "",
    profilePicture: user.profilePicture || "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      console.log("Selected file:", file);
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/update/${userId}`,
        {
          method: "PATCH",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        console.log("Profile updated:", updatedUser);
        setIsEditing(false);
      } else {
        console.error("Failed to update profile:", await response.text());
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const openFollowView = (type) => {
    setFollowType(type);
    setIsFollowViewOpen(true);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-full md:w-[30vw] bg-white shadow-2xl shadow-black z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">My Profile</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          ✕
        </button>
      </div>

      {/* Profile Section */}
      {!isFollowViewOpen ? (
        <div className="p-6 space-y-6 text-center">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={
                previewImage ||
                formData.profilePicture ||
                "default-profile-picture-url"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full mx-auto object-cover border border-gray-300"
            />
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange} // Specific function for file input.
                  className="mt-2"
                />
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full border rounded px-2 py-1 text-center"
                placeholder="Name"
              />
            ) : (
              <p className="text-lg font-semibold">{formData.name}</p>
            )}
          </div>

          {/* Username */}
          <div>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="block w-full border rounded px-2 py-1 text-center"
                placeholder="Username"
              />
            ) : (
              <p className="text-gray-500">@{formData.username}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1 text-center"
                placeholder="Add a bio"
              />
            ) : (
              <p className="text-gray-600">{formData.bio}</p>
            )}
          </div>

          {/* Follower Stats */}
          <div className="flex justify-around items-center">
            <button
              onClick={() => openFollowView("followers")}
              className="flex flex-col items-center text-blue-500 hover:underline"
            >
              <span className="text-xl font-bold">{user.followersCount}</span>
              <span className="text-sm">Followers</span>
            </button>
            <button
              onClick={() => openFollowView("following")}
              className="flex flex-col items-center text-blue-500 hover:underline"
            >
              <span className="text-xl font-bold">{user.followingCount}</span>
              <span className="text-sm">Following</span>
            </button>
          </div>
        </div>
      ) : (
        <Followed
          type={followType}
          userId={userId}
          onClose={() => setIsFollowViewOpen(false)}
        />
      )}

      {/* Footer Actions */}
      <div className="p-4 border-t flex justify-between">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={handleEditToggle}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleEditToggle}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Edit Profile
          </button>
        )}
      </div>
      {user.isAdmin && (
        <Link
          to="/Home/dashboard"
          className="bg-green-500 p-3 text-white rounded-lg ml-40"
        >
          Go to dashboard
        </Link>
      )}
    </motion.div>
  );
};

export default UserProfileSidebar;

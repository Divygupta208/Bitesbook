import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import UserManagement from "./admin-users";
import RecipeManagement from "./admin-recipes";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>
      <div className="flex flex-grow">
        {/* Sidebar */}
        <nav className="w-1/4 bg-white shadow-md p-6">
          <ul>
            <li>
              <button
                className={`block w-full text-left py-2 px-4 rounded ${
                  activeTab === "users"
                    ? "bg-black text-white"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveTab("users")}
              >
                Manage Users
              </button>
            </li>
            <li>
              <button
                className={`block w-full text-left py-2 px-4 rounded ${
                  activeTab === "recipes"
                    ? "bg-black text-white"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveTab("recipes")}
              >
                Manage Recipes
              </button>
            </li>
          </ul>
        </nav>
        {/* Main Content */}
        <main className="flex-grow p-6">
          {activeTab === "users" && <UserManagement />}
          {activeTab === "recipes" && <RecipeManagement />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiSearch, FiUser } from "react-icons/fi";
import { GoHomeFill } from "react-icons/go";
import { PiBowlFoodFill } from "react-icons/pi";
import { RxActivityLog } from "react-icons/rx";
import UserProfileSidebar from "./userprofile";
import SearchResults from "./search";
import { useSelector } from "react-redux";
import axios from "axios";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searched, setSearched] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searched);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searched);
    }, 100);

    return () => clearTimeout(timer);
  }, [searched]);

  const handleSearch = async (e) => {
    setSearched(e.target.value);
    const token = localStorage.getItem("token");
    if (debouncedSearchTerm.trim() !== "") {
      try {
        const response = await fetch(
          `https://my-api.zapto.org/bitesbook/search/recipes?query=${encodeURIComponent(
            debouncedSearchTerm
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const menuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <>
      <motion.nav
        className="bg-stone-900 text-white shadow-lg fixed w-full z-50"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-white">
                BitesBook
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center">
              <div className="relative mr-4">
                <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searched}
                  onChange={handleSearch}
                  onBlur={() => setSearched("")}
                  className="bg-gray-800 text-white rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              {searched && <SearchResults searchResults={searchResults} />}
              <Link
                to="/home/feed"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition flex flex-col"
              >
                <RxActivityLog className="w-5 h-5 ml-2" />
                <p>Feed</p>
              </Link>
              <Link
                to="/home"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition flex flex-col"
              >
                <GoHomeFill className="w-5 h-5 ml-2" />
                <p>Home</p>
              </Link>
              <Link
                to="/Home/myrecipes"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition flex flex-col"
              >
                <PiBowlFoodFill className="w-5 h-5 ml-5" />
                <p>My Recipes</p>
              </Link>
            </div>

            {/* Profile Section */}
            <div className="hidden md:flex md:items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative cursor-pointer"
              >
                <FiUser
                  className="h-7 w-8 text-red-400"
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                />
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-gray-800"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="relative mb-3">
                <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className="w-full bg-gray-700 text-white rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <Link
                to="/feed"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition"
              >
                <GoHomeFill /> Feed
              </Link>
              <Link
                to="/recipes"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition"
              >
                <PiBowlFoodFill /> Recipe
              </Link>
              <div className="mt-3 border-t border-gray-700 pt-4">
                <div className="flex items-center px-5">
                  <FiUser className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Sidebar Component */}
      <UserProfileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default Navbar;

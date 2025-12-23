import Button from "@/Pages/Layouts/Components/Button";
import { confirmLogout } from "@/Utils/Helpers/SwalHelpers";
import React from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuthStateContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    confirmLogout(async () => {
      await logout(); // ✅ Gunakan logout dari context (Supabase)
      navigate("/", { replace: true });
    });
  };

  const toggleProfileMenu = () => {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("hidden");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Admin Panel</h1>
          {user && (
            <p className="text-sm text-gray-600">
              Login sebagai: <strong>{user.email}</strong>
            </p>
          )}
        </div>

        <div className="relative">
          <Button
            onClick={toggleProfileMenu}
            className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none"
          />

          <div
            id="profileMenu"
            className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 hidden"
          >
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Profile
            </a>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
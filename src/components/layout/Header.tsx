import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { logOut } from "../../services/authService";

export const Header = () => {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    await logOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-20 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">CollabCanvas</h1>
        <span className="text-sm text-gray-600">
          Signed in as{" "}
          {currentUser?.displayName || currentUser?.email || "Guest"}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
      >
        Logout
      </button>
    </header>
  );
};

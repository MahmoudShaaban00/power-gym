"use client";

import React from "react";
import { GiWeightLiftingUp } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("idsubscription");
  };

  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-indigo-900 to-purple-900 px-6 py-4 shadow-lg">
      {/* ✅ Left Side - Logo + Name */}
      <div className="flex items-center gap-3 text-white">
        <GiWeightLiftingUp className="text-3xl text-yellow-400" />
        <h1 className="text-xl font-bold">Power Gym</h1>
      </div>

      {/* ✅ Right Side - Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-300"
      >
        <FiLogOut className="text-lg" />
        <span>Logout</span>
      </button>
    </nav>
  );
}

"use client";

import React, { useState } from "react";
import { useOwner } from "@/context/ownerContext";
import { EmployeePayload } from "../../../context/ownerContext";

export default function CreateEmployeePage() {
  const { createEmployee, loading } = useOwner();

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    password: "",
    role: "Admin",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEmployee(form as EmployeePayload);
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

    <div className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-white/80 backdrop-blur-xl 
                    border border-gray-200 shadow-xl">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        Create Admin
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Email */}
        <div>
          <label className="text-gray-700 mb-1 block">Email</label>
          <input
            className="w-full p-3 rounded-xl bg-white border border-gray-300 text-gray-800 
                       placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                       focus:shadow-lg transition"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="text-gray-700 mb-1 block">Full Name</label>
          <input
            className="w-full p-3 rounded-xl bg-white border border-gray-300 text-gray-800 
                       placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                       focus:shadow-lg transition"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="text-gray-700 mb-1 block">Phone Number</label>
          <input
            className="w-full p-3 rounded-xl bg-white border border-gray-300 text-gray-800 
                       placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                       focus:shadow-lg transition"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-gray-700 mb-1 block">Password</label>
          <input
            type="password"
            className="w-full p-3 rounded-xl bg-white border border-gray-300 text-gray-800 
                       placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                       focus:shadow-lg transition"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Role */}
        <div>
          <label className="text-gray-700 mb-1 block">Role</label>
          <select
            className="w-full p-3 rounded-xl bg-white border border-gray-300 text-gray-800 
                       focus:outline-none focus:border-indigo-500 focus:shadow-lg transition"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="Admin" className="text-black">Admin</option>
            <option value="Employee" className="text-black">Employee</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-lg font-bold text-white rounded-xl 
                     bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg
                     hover:scale-105 hover:shadow-2xl transition-all disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Employee"}
        </button>
      </form>
    </div>
  </div>
);

}

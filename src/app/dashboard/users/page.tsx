import React from "react";

export default function Page() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">👥 Users</h2>
      <p className="text-gray-700">Here you can manage all registered users.</p>

      {/* مثال جدول للـ Users */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">1</td>
              <td className="border border-gray-300 px-4 py-2">Mahmoud</td>
              <td className="border border-gray-300 px-4 py-2">mahmoud@test.com</td>
              <td className="border border-gray-300 px-4 py-2">Admin</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">2</td>
              <td className="border border-gray-300 px-4 py-2">Ali</td>
              <td className="border border-gray-300 px-4 py-2">ali@test.com</td>
              <td className="border border-gray-300 px-4 py-2">User</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useOwner, Owner } from "@/context/ownerContext";
import { Dialog } from "@headlessui/react";

export default function OwnersPage() {
  const { getOwners, deleteOwner, updateOwner, loading } = useOwner();
  const [owners, setOwners] = useState<Owner[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<"Admin" | "Employee">("Admin");

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    const data = await getOwners();
    setOwners(data);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this admin?");
    if (!confirmed) return;

    const success = await deleteOwner(id);
    if (success) fetchOwners();
  };

  const openUpdateModal = (owner: Owner) => {
    setSelectedOwner(owner);
    setFullName(owner.fullName);
    setEmail(owner.email);
    setPhoneNumber(owner.phoneNumber);
    setRole(owner.role as "Admin" | "Employee");
    setIsOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedOwner) return;

    const success = await updateOwner({
      ...selectedOwner,
      fullName,
      email,
      phoneNumber,
      role,
    });

    if (success) {
      fetchOwners();
      setIsOpen(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Admins / Owners</h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && owners.length === 0 && (
        <p className="text-gray-500">No admins found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {owners.map((owner) => (
          <div
            key={owner.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-semibold text-gray-800">{owner.fullName}</h2>
            <p className="text-gray-600 mt-1">{owner.email}</p>
            <p className="text-gray-600 mt-1">{owner.phoneNumber}</p>
            <span className="inline-block mt-3 px-3 py-1 text-sm font-medium text-white bg-indigo-500 rounded-full">
              {owner.role}
            </span>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => openUpdateModal(owner)}
                className="flex-1 px-3 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(owner.id)}
                className="flex-1 px-3 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Update Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <Dialog.Panel className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl transition-all duration-300">
          <Dialog.Title className="text-2xl font-bold mb-4 text-gray-800">
            Update Admin
          </Dialog.Title>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "Admin" | "Employee")}
                className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              >
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 shadow transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg transition-all duration-300"
              >
                Save
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

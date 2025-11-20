"use client";

import React, { useEffect, useState } from "react";
import { useMember } from "../../../context/memberContext";
import { useAttendance } from "../../../context/attendenceContext";
import { toast } from "react-toastify";

export default function MembersPage() {
  const { members, loading, getMembers, deleteMember, updateMember } = useMember();
  const { markAttendance, deleteAttendance, getMemberAttendances } = useAttendance();

  const [editMember, setEditMember] = useState<any>(null);
  const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});
  const [attendanceMap, setAttendanceMap] = useState<{ [memberId: string]: any[] }>({});
  const [showAttendanceMap, setShowAttendanceMap] = useState<{ [memberId: string]: boolean }>({});
  const [searchSubscriptionId, setSearchSubscriptionId] = useState("");
  const [token, setToken] = useState("");

  // ------------------------
  //     CLIENT PAGINATION
  // ------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(members.length / pageSize);

  const paginatedMembers = members.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // ------------------------

  const fetchMembers = async () => {
    const subscriptionId = searchSubscriptionId || "1";
    await getMembers(subscriptionId, 1000, 1); // نجيب كل الـ array
    setCurrentPage(1);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);

    fetchMembers();
  }, []);

  const fetchAttendances = async (memberId: string) => {
    if (!token) return toast.error("Token missing");
    setLoadingMap((prev) => ({ ...prev, [memberId]: true }));
    try {
      const attendances = await getMemberAttendances(memberId, token);
      setAttendanceMap((prev) => ({ ...prev, [memberId]: attendances }));
      setShowAttendanceMap((prev) => ({ ...prev, [memberId]: true }));
    } catch {
      toast.error("Failed to fetch attendances");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const handleMarkAttendance = async (memberId: string) => {
    if (!token) return toast.error("Token missing");
    setLoadingMap((prev) => ({ ...prev, [memberId]: true }));
    try {
      await markAttendance(memberId, token);
      await fetchAttendances(memberId);
      toast.success("Attendance marked!");
    } catch {
      toast.error("Failed to mark attendance");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const handleDeleteAttendance = async (memberId: string, dayDate: string) => {
    if (!token) return toast.error("Token missing");
    setLoadingMap((prev) => ({ ...prev, [memberId]: true }));
    try {
      await deleteAttendance(memberId, dayDate, token);
      await fetchAttendances(memberId);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const handleSave = async () => {
    if (!editMember) return;
    try {
      await updateMember(editMember.id, editMember);
      toast.success("Member updated!");
      setEditMember(null);
      fetchMembers();
    } catch {
      toast.error("Failed to update member");
    }
  };

  const handleSearch = () => {
    fetchMembers();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Members Management</h1>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter Subscription ID"
          value={searchSubscriptionId}
          onChange={(e) => setSearchSubscriptionId(e.target.value)}
          className="border p-2 rounded-lg w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Members List */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : paginatedMembers.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No members found</p>
      ) : (
        <div className="space-y-6">
          {paginatedMembers.map((m: any) => (
            <div key={m.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{m.fullName}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMember(m)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleMarkAttendance(m.id)}
                    disabled={loadingMap[m.id]}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    {loadingMap[m.id] ? "Marking..." : "Mark Attendance"}
                  </button>
                  <button
                    onClick={() =>
                      showAttendanceMap[m.id]
                        ? setShowAttendanceMap((prev) => ({ ...prev, [m.id]: false }))
                        : fetchAttendances(m.id)
                    }
                    disabled={loadingMap[m.id]}
                    className={`${
                      showAttendanceMap[m.id] ? "bg-red-500" : "bg-purple-500"
                    } text-white px-3 py-1 rounded`}
                  >
                    {showAttendanceMap[m.id] ? "Close Attendance" : "Show Attendances"}
                  </button>
                  <button
                    onClick={() => deleteMember(m.id).then(fetchMembers)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                <div>Email: {m.email}</div>
                <div>Phone: {m.phoneNumber}</div>
                <div>Pay: {m.pay}</div>
                <div>Rest Money: {m.restMoney}</div>
                <div>Subscription ID: {m.subscriptionId}</div>
              </div>

              {showAttendanceMap[m.id] && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Member Attendances:</h3>
                  {attendanceMap[m.id]?.length > 0 ? (
                    <table className="min-w-full text-sm border border-gray-200 rounded">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 border">Date</th>
                          <th className="px-2 py-1 border">Check In</th>
                          <th className="px-2 py-1 border">Check Out</th>
                          <th className="px-2 py-1 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceMap[m.id].map((att: any) => (
                          <tr key={att.id} className="hover:bg-gray-50">
                            <td className="px-2 py-1 border">
                              {new Date(att.date).toLocaleDateString()}
                            </td>
                            <td className="px-2 py-1 border">{att.checkInTime || "-"}</td>
                            <td className="px-2 py-1 border">{att.checkOutTime || "-"}</td>
                            <td className="px-2 py-1 border">
                              <button
                                onClick={() =>
                                  handleDeleteAttendance(m.id, att.date.split("T")[0])
                                }
                                disabled={loadingMap[m.id]}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                              >
                                Delete Attendance
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-400 italic">No attendance found</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-semibold">
          {currentPage} / {totalPages === 0 ? 1 : totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Edit Member Modal */}
      {editMember && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[500px]">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Update Member</h2>

            <div className="grid grid-cols-1 gap-4">
              <input
                className="w-full border p-3 rounded-lg"
                value={editMember.fullName}
                onChange={(e) => setEditMember({ ...editMember, fullName: e.target.value })}
                placeholder="Full Name"
              />
              <input
                className="w-full border p-3 rounded-lg"
                value={editMember.email}
                onChange={(e) => setEditMember({ ...editMember, email: e.target.value })}
                placeholder="Email"
              />
              <input
                className="w-full border p-3 rounded-lg"
                value={editMember.phoneNumber}
                onChange={(e) => setEditMember({ ...editMember, phoneNumber: e.target.value })}
                placeholder="Phone Number"
              />
              <input
                className="w-full border p-3 rounded-lg"
                value={editMember.pay}
                onChange={(e) => setEditMember({ ...editMember, pay: e.target.value })}
                placeholder="Pay"
              />
              <input
                className="w-full border p-3 rounded-lg"
                value={editMember.restMoney}
                onChange={(e) => setEditMember({ ...editMember, restMoney: e.target.value })}
                placeholder="Rest Money"
              />
              <input
                className="w-full border p-3 rounded-lg"
                value={editMember.subscriptionId}
                onChange={(e) =>
                  setEditMember({ ...editMember, subscriptionId: e.target.value })
                }
                placeholder="Subscription ID"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() => setEditMember(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

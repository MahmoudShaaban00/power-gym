"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useMember } from "../../../context/memberContext";
import { useAttendance } from "../../../context/attendenceContext";
import { toast } from "react-toastify";
import { Member, Attendance, ExpiryData } from "@/utility/types";
import { useRouter } from "next/navigation";

export default function MembersPage() {
  const { members, loading, getMembers, deleteMember, updateMember, getExpiryMember } = useMember();
  const { markAttendance, deleteAttendance, getMemberAttendances } = useAttendance();

  const [editMember, setEditMember] = useState<Member | null>(null);
  const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});
  const [attendanceMap, setAttendanceMap] = useState<{ [memberId: string]: Attendance[] }>({});
  const [showAttendanceMap, setShowAttendanceMap] = useState<{ [memberId: string]: boolean }>({});
  const [searchSubscriptionId, setSearchSubscriptionId] = useState("");
  const [showExpiryMap, setShowExpiryMap] = useState<{ [key: string]: boolean }>({});
  const [expiryMap, setExpiryMap] = useState<{ [memberId: string]: ExpiryData | null }>({});
  const router = useRouter()

  const [token, setToken] = useState("");

  // ------------------------
  // Pagination
  // ------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(members.length / pageSize);
  const paginatedMembers = members.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  // ------------------------
  // Fetch members
  // ------------------------
const fetchMembers = useCallback(async () => {
  const subscriptionId = searchSubscriptionId || "1";
  await getMembers(subscriptionId, 1000, 1);
  setCurrentPage(1);
}, [searchSubscriptionId, getMembers]);


  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
    fetchMembers();
  }, []);

  // ------------------------
  // Attendance functions
  // ------------------------
  const fetchAttendances = async (memberId: string) => {
    if (!token) return toast.error("Token مفقود");
    setLoadingMap(prev => ({ ...prev, [memberId]: true }));
    try {
      const attendances = await getMemberAttendances(memberId, token);
      setAttendanceMap(prev => ({ ...prev, [memberId]: attendances }));
      setShowAttendanceMap(prev => ({ ...prev, [memberId]: true }));
    } catch {
      toast.error("فشل في جلب الغياب");
    } finally {
      setLoadingMap(prev => ({ ...prev, [memberId]: false }));
    }
  };

  //handle record attendence
  const handleMarkAttendance = async (memberId: string) => {
    if (!token) return toast.error("Token مفقود");
    setLoadingMap(prev => ({ ...prev, [memberId]: true }));
    try {
      await markAttendance(memberId, token);
      await fetchAttendances(memberId);
    } catch {
      toast.error("فشل في تسجيل الحضور");
    } finally {
      setLoadingMap(prev => ({ ...prev, [memberId]: false }));
    }
  };

  //handle delete
  const handleDeleteAttendance = async (memberId: string, dayDate: string) => {
    if (!token) return toast.error("Token مفقود");
    setLoadingMap(prev => ({ ...prev, [memberId]: true }));
    try {
      await deleteAttendance(memberId, dayDate, token);
      await fetchAttendances(memberId);
    } finally {
      setLoadingMap(prev => ({ ...prev, [memberId]: false }));
    }
  };

  // ------------------------
  // Update member
  // ------------------------
  const handleSave = async () => {
    if (!editMember) return;
    try {
      await updateMember(editMember.id, {
        fullName: editMember.fullName,
        email: editMember.email,
        phoneNumber: editMember.phoneNumber,
        pay: String(editMember.pay),
        restMoney: String(editMember.restMoney),
        subscriptionId: editMember.subscriptionId,
      });
      setEditMember(null);
      fetchMembers();
    } catch {
      toast.error("فشل في تحديث العضو");
    }
  };

  // ------------------------
  // Search
  // ------------------------
  const handleSearch = () => { fetchMembers(); };

  // ------------------------
  // Fetch expiry data
  // ------------------------
  const fetchExpiry = async (memberId: string) => {
    const expiryData = await getExpiryMember(memberId);
    if (expiryData) {
      setExpiryMap(prev => ({ ...prev, [memberId]: expiryData }));
    }
    setShowExpiryMap(prev => ({ ...prev, [memberId]: true }));
  };

  //-------------------------
  // handle id of member
  //-------------------------
  const handleIdMember = (memberId: string) => {
    console.log(memberId)
    localStorage.setItem("memberId",memberId);
    router.push("/dashboard/Trainers")
  }

  // ------------------------
  // Render
  // ------------------------
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">إدارة الأعضاء</h1>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="أدخل رقم الاشتراك"
          value={searchSubscriptionId}
          onChange={(e) => setSearchSubscriptionId(e.target.value)}
          className="border p-2 rounded-lg w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          بحث
        </button>
      </div>

      {/* Members list */}
      {loading ? (
        <p className="text-gray-500">جارٍ التحميل...</p>
      ) : paginatedMembers.length === 0 ? (
        <p className="text-center text-gray-500 py-4">لا يوجد أعضاء</p>
      ) : (
        <div className="space-y-6">
          {paginatedMembers.map((m: Member) => (
            <div key={m.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{m.fullName}</h2>
                <div className="flex gap-2">

                  {/* button to update info of member */}
                  <button
                    onClick={() => setEditMember(m)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    تعديل
                  </button>

                  {/* button to record attendence */}
                  <button
                    onClick={() => handleMarkAttendance(m.id)}
                    disabled={loadingMap[m.id]}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    {loadingMap[m.id] ? "جارٍ التسجيل..." : "تسجيل الغياب"}
                  </button>

                  {/* button to fetch attendence */}
                  <button
                    onClick={() =>
                      showAttendanceMap[m.id]
                        ? setShowAttendanceMap(prev => ({ ...prev, [m.id]: false }))
                        : fetchAttendances(m.id)
                    }
                    disabled={loadingMap[m.id]}
                    className={`${showAttendanceMap[m.id] ? "bg-red-500" : "bg-purple-500"} text-white px-3 py-1 rounded`}
                  >
                    {showAttendanceMap[m.id] ? "إغلاق الغياب" : "عرض الغياب"}
                  </button>

                  {/* button to delete member */}
                  <button
                    onClick={() => deleteMember(m.id).then(fetchMembers)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    حذف
                  </button>

                  {/* button to show expiry date */}
                  <button
                    onClick={() =>
                      showExpiryMap[m.id]
                        ? setShowExpiryMap(prev => ({ ...prev, [m.id]: false }))
                        : fetchExpiry(m.id)
                    }
                    className={`${showExpiryMap[m.id] ? "bg-red-500" : "bg-blue-500"} text-white px-3 py-1 rounded`}
                  >
                    {showExpiryMap[m.id] ? "إخفاء البيانات" : "عرض تاريخ الانتهاء"}
                  </button>
                  {showExpiryMap[m.id] && expiryMap[m.id] ? (
                    <div className="mt-2 text-blue-600 font-semibold">
                      <p>
                        تاريخ الانتهاء: {expiryMap[m.id]?.expiryDate ? new Date(expiryMap[m.id]!.expiryDate).toLocaleDateString() : "-"}
                      </p>
                      <p>عدد الجلسات المتبقية: {expiryMap[m.id]?.sessionsNumber ?? "-"}</p>
                    </div>
                  ) : null}

                  {/* button to add trainne to trainer */}
                  <button
                    onClick={() => handleIdMember(m.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    اختار المدرب
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                <div>البريد الإلكتروني: {m.email}</div>
                <div>الهاتف: {m.phoneNumber}</div>
                <div>الدفع: {m.pay}</div>
                <div>المتبقي: {m.restMoney}</div>
                <div>رقم الاشتراك: {m.subscriptionId}</div>
              </div>

              {/* Show attendance */}
              {showAttendanceMap[m.id] && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">حضور العضو:</h3>
                  {attendanceMap[m.id]?.length > 0 ? (
                    <table className="min-w-full text-sm border border-gray-200 rounded">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 border">التاريخ</th>
                          <th className="px-2 py-1 border">وقت الدخول</th>
                          <th className="px-2 py-1 border">وقت الخروج</th>
                          <th className="px-2 py-1 border">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceMap[m.id].map((att: Attendance) => (
                          <tr key={att.id} className="hover:bg-gray-50">
                            <td className="px-2 py-1 border">{new Date(att.date).toLocaleDateString()}</td>
                            <td className="px-2 py-1 border">{att.checkInTime || "-"}</td>
                            <td className="px-2 py-1 border">{att.checkOutTime || "-"}</td>
                            <td className="px-2 py-1 border">
                              <button
                                onClick={() => handleDeleteAttendance(m.id, att.date.split("T")[0])}
                                disabled={loadingMap[m.id]}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                              >
                                حذف الغياب
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-400 italic">لا يوجد حضور</p>
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
          السابق
        </button>

        <span className="font-semibold">
          {currentPage} / {totalPages === 0 ? 1 : totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          التالي
        </button>
      </div>

      {/* Edit Member Modal */}
      {editMember && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[500px]">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">تحديث العضو</h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                className="w-full border p-3 rounded-lg"
                value={editMember.fullName}
                onChange={(e) => setEditMember({ ...editMember, fullName: e.target.value })}
                placeholder="الاسم الكامل"
              />
              <input
                className="w-full border p-3 rounded-lg"
                value={editMember.email}
                onChange={(e) => setEditMember({ ...editMember, email: e.target.value })}
                placeholder="البريد الإلكتروني"
              />
              <input
                className="w-full border p-3 rounded-lg"
                value={editMember.phoneNumber}
                onChange={(e) => setEditMember({ ...editMember, phoneNumber: e.target.value })}
                placeholder="رقم الهاتف"
              />
              <input
                className="w-full border p-3 rounded-lg"
                value={editMember.pay}
                onChange={(e) => setEditMember({ ...editMember, pay: Number(e.target.value) })}
                placeholder="الدفع"
              />
              <input
                className="w-full border p-3 rounded-lg"
                value={editMember.restMoney}
                onChange={(e) => setEditMember({ ...editMember, restMoney: Number(e.target.value) })}
                placeholder="المتبقي"
              />
              <input
                className="w-full border p-3 rounded-lg"
                value={editMember.subscriptionId}
                onChange={(e) => setEditMember({ ...editMember, subscriptionId: e.target.value })}
                placeholder="رقم الاشتراك"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                حفظ
              </button>
              <button
                onClick={() => setEditMember(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

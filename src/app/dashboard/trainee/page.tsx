"use client";

import React, { useEffect, useState } from "react";
import { useTrainer } from "@/context/trainerContext";

export interface Trainee {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  pay: number;
}

export default function TraineesPage() {
  const { getTraineesOfTrainer, deleteTraineeFromTrainer } = useTrainer();

  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // =============================
  // 🔵 Fetch trainees
  // =============================
  const fetchTrainees = async (page = 1, searchText = "") => {
    const trainerId = localStorage.getItem("trainerId");
    if (!trainerId) return;

    setLoading(true);
    try {
      const result = await getTraineesOfTrainer(trainerId, searchText, page, pageSize);
      if (!result) {
        setTrainees([]);
        setTotalCount(0);
        return;
      }

      // تحديث المتدربين للصفحة الحالية
      setTrainees(result.data);
      // استخدام العدد الإجمالي لجميع النتائج لحساب totalPages
      setTotalCount(result.count);
    } catch (err) {
      console.error(err);
      setTrainees([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔵 Handle search
  // =============================
  const handleSearch = () => {
    setPageIndex(1); // إعادة الصفحة الأولى عند البحث
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // =============================
  // 🔵 Handle pagination
  // =============================
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPageIndex(newPage);
  };

  // =============================
  // 🔵 Handle delete
  // =============================
  const handleDelete = async (traineeId: string) => {
    const trainerId = localStorage.getItem("trainerId");
    if (!trainerId) return;

    await deleteTraineeFromTrainer(trainerId, traineeId);
    // بعد الحذف جلب الصفحة الحالية مرة أخرى
    fetchTrainees(pageIndex, search);
  };

  // =============================
  // 🔵 useEffect للتحميل
  // =============================
  useEffect(() => {
    fetchTrainees(pageIndex, search);
  }, [pageIndex, search]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">👥 قائمة المتدربين</h1>

      {/* البحث */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="ابحث بالاسم أو البريد..."
          className="border p-2 rounded w-64 focus:ring-2 focus:ring-blue-200 outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          بحث
        </button>
      </div>

      {loading && <p className="text-gray-500 mb-3 animate-pulse">جارٍ التحميل...</p>}
      <p className="mb-4 text-gray-600">عدد النتائج الإجمالي: {totalCount}</p>

      {/* جدول المتدربين */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full text-center border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">الاسم</th>
              <th className="p-3">البريد الإلكتروني</th>
              <th className="p-3">رقم الهاتف</th>
              <th className="p-3">المدفوعات</th>
              <th className="p-3">حذف المتدرب</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {trainees.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-gray-500">
                  لا يوجد متدربين
                </td>
              </tr>
            ) : (
              trainees.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-2">{t.fullName}</td>
                  <td className="p-2">{t.email}</td>
                  <td className="p-2">{t.phoneNumber}</td>
                  <td className="p-2">{t.pay.toLocaleString()} ج.م</td>
                  <td>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      حذف المتدرب
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-3">
        <button
          disabled={pageIndex === 1}
          onClick={() => handlePageChange(pageIndex - 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400 transition"
        >
          السابق
        </button>
        <span className="px-2 py-2">
          {pageIndex} / {totalPages}
        </span>
        <button
          disabled={pageIndex === totalPages}
          onClick={() => handlePageChange(pageIndex + 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400 transition"
        >
          التالي
        </button>
      </div>
    </div>
  );
}

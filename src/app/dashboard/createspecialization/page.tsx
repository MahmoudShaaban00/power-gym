"use client";

import React, { useState, useEffect } from "react";
import { useSpecialization } from "@/context/specializationContext";

export default function SpecializationsPage() {
  const {
    createSpecialization,
    getSpecializations,
    specializations,
    updateSpecialization,
    deleteSpecialization,
    loading,
  } = useSpecialization();

  const [name, setName] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);

  // احصل على التوكن
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  // useEffect مع dependency array صحيحة
  useEffect(() => {
    getSpecializations(token);
  }, [getSpecializations, token]);

  // handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editId) {
      await updateSpecialization(editId, name, token);
      setEditId(null);
    } else {
      await createSpecialization(name, token);
    }

    setName("");
  };

  // بدء التعديل
  const startEdit = (id: string, currentName: string) => {
    setEditId(id);
    setName(currentName);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
          🏷️ إدارة التخصصات
        </h1>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
          <input
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
            placeholder="اكتب اسم التخصص..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg text-white font-semibold transition shadow-md ${
                editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "جارٍ التنفيذ..." : editId ? "تعديل" : "إضافة"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setName("");
                }}
                className="px-6 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-semibold shadow-md transition"
              >
                إلغاء
              </button>
            )}
          </div>
        </form>

        {/* LIST */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          📋 جميع التخصصات
        </h2>

        {loading ? (
          <p className="text-gray-500 animate-pulse">جارٍ التحميل...</p>
        ) : specializations.length === 0 ? (
          <p className="text-gray-500">لا توجد تخصصات مسجلة.</p>
        ) : (
          <ul className="space-y-3">
            {specializations.map((sp) => (
              <li
                key={sp.id}
                className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition"
              >
                <span className="text-lg font-medium text-gray-700">{sp.id}</span>
                <span className="text-lg font-medium text-gray-700">{sp.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(sp.id, sp.name)}
                    className="px-4 py-1 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => deleteSpecialization(sp.id, token)}
                    className="px-4 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold shadow"
                  >
                    حذف
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useSubscription } from "@/context/subscriptionContext";
import { SubscriptionFormValues } from "@/utility/types";

export default function AllSubscriptionsWithUpdate() {
  const {
    allSubscriptions,
    getAllSubscription,
    deleteSubscription,
    updateSubscription,
    loading,
  } = useSubscription();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<SubscriptionFormValues>>({});

useEffect(() => {
  getAllSubscription();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const handleEditClick = (sub: SubscriptionFormValues & { id: number }) => {
    setEditingId(sub.id);
    setEditValues(sub);
  };

  const handleUpdate = async () => {
    if (editingId !== null) {
      await updateSubscription(editingId, editValues as SubscriptionFormValues);
      setEditingId(null);
      await getAllSubscription();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 rounded-3xl shadow-xl">
      <h1 className="text-4xl font-bold mb-8 text-blue-700 text-center">
        إدارة الاشتراكات
      </h1>

      {loading && (
        <p className="text-center text-gray-600 mb-4">جارٍ تحميل البيانات...</p>
      )}

      <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-blue-200 text-blue-900 font-semibold text-lg">
          <tr>
            <th className="border p-3">الرقم</th>
            <th className="border p-3">الاسم</th>
            <th className="border p-3">المدة (شهور)</th>
            <th className="border p-3">رقم النادي</th>
            <th className="border p-3">عدد الجلسات</th>
            <th className="border p-3">عدد الدعوات</th>
            <th className="border p-3">أيام الأسبوع</th>
            <th className="border p-3">السعر (جنيه)</th>
            <th className="border p-3">الإجراءات</th>
          </tr>
        </thead>

        <tbody>
          {allSubscriptions.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center p-4 text-gray-500">
                لا توجد اشتراكات حالياً
              </td>
            </tr>
          ) : (
            allSubscriptions.map((sub, index) => {
              const id = index + 1; // أو إذا كان لديك id من الـ backend استخدمه
              return (
                <tr
                  key={id}
                  className="text-center border-b hover:bg-gray-100 transition-colors"
                >
                  {editingId === id ? (
                    <>
                      <td className="border p-2">{id}</td>
                      <td className="border p-2">
                        <input
                          value={editValues.name}
                          onChange={(e) =>
                            setEditValues({ ...editValues, name: e.target.value })
                          }
                          className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={editValues.duration}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              duration: e.target.value,
                            })
                          }
                          className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={editValues.fitnessNumber}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              fitnessNumber: e.target.value,
                            })
                          }
                          className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={editValues.sessionsNumber}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              sessionsNumber: e.target.value,
                            })
                          }
                          className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={editValues.inviteCount}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              inviteCount: e.target.value,
                            })
                          }
                          className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={editValues.daysPerWeek}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              daysPerWeek: e.target.value,
                            })
                          }
                          className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={editValues.price}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              price: e.target.value,
                            })
                          }
                          className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="border p-2 flex justify-center gap-2">
                        <button
                          onClick={handleUpdate}
                          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                        >
                          حفظ
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 transition"
                        >
                          إلغاء
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border p-2">{id}</td>
                      <td className="border p-2">{sub.name}</td>
                      <td className="border p-2">{sub.duration}</td>
                      <td className="border p-2">{sub.fitnessNumber}</td>
                      <td className="border p-2">{sub.sessionsNumber}</td>
                      <td className="border p-2">{sub.inviteCount}</td>
                      <td className="border p-2">{sub.daysPerWeek}</td>
                      <td className="border p-2">{sub.price} ج</td>
                      <td className="border p-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick({ ...sub, id })}
                          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => deleteSubscription(id)}
                          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                        >
                          حذف
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTrainer } from "../../../context/trainerContext";
import { TrainerFormValues, Trainer } from "@/utility/types";
import { useRouter } from "next/navigation";

export default function TrainersListPage() {
  const {
    trainers,
    getTrainers,
    updateTrainer,
    deleteTrainer,
    loading,
    totalCount,
    addTraineeToTrainer
  } = useTrainer();

  const [search, setSearch] = useState("");
  const [specializationIdInput, setSpecializationIdInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
    const router = useRouter()

  const [editValues, setEditValues] = useState<TrainerFormValues>({
    fullName: "",
    phoneNumber: "",
    specializationIds: [],
  });

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;

  // البحث وتحميل المدربين
  const handleSearch = useCallback(
    async (newPageIndex = 1) => {
      setPageIndex(newPageIndex);
      const specializationId = specializationIdInput
        ? parseInt(specializationIdInput)
        : undefined;

      await getTrainers({
        specializationId,
        pageSize,
        pageIndex: newPageIndex,
        search,
      });
    },
    [specializationIdInput, search, getTrainers]
  );

  useEffect(() => {
    handleSearch(1);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(1);
  };

  // حفظ التعديل
  const handleUpdate = async (id: string) => {
    try {
      await updateTrainer(id, editValues);
      setEditingId(null);
      await handleSearch(pageIndex);
    } catch (err) {
      console.error(err);
    }
  };

  // حذف المدرب
  const handleDeleteTrainer = async (id: string) => {
    try {
      await deleteTrainer(id);
      await handleSearch(pageIndex);
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // handle add trainne to trainer
  const handleSelectTrainer = async (trainerId: string) => {
    const traineeId = localStorage.getItem("memberId");

    console.log("traineeId", traineeId, "trainerId", trainerId);

    if (!traineeId) {
      alert("لا يوجد متدرب مختار!");
      return;
    }

    await addTraineeToTrainer(trainerId, traineeId);
  };

// 🔵 handle Trainer ID
  const handleIdTrainer = (trainerId: string) => {
    console.log(trainerId)
    localStorage.setItem("trainerId",trainerId);
    router.push("/dashboard/trainee")
  }



  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        👨‍🏫 قائمة المدربين
      </h1>

      {/* البحث */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="ابحث بالاسم..."
          className="border p-2 rounded w-64 focus:ring-2 focus:ring-blue-200 outline-none"
        />

        <input
          type="text"
          value={specializationIdInput}
          onChange={(e) => setSpecializationIdInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="أدخل رقم التخصص"
          className="border p-2 rounded w-64 focus:ring-2 focus:ring-blue-200 outline-none"
        />

        <button
          onClick={() => handleSearch(1)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          بحث
        </button>
      </div>

      {loading && (
        <p className="text-gray-500 mb-3 animate-pulse">جارٍ التحميل...</p>
      )}

      <p className="mb-4 text-gray-600">عدد النتائج: {totalCount}</p>

      {/* جدول المدربين */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full text-center border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">الاسم</th>
              <th className="p-3">رقم الهاتف</th>
              <th className="p-3">التخصصات</th>
              <th className="p-3">الإجراءات</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {trainers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-gray-500">
                  لا يوجد مدربين
                </td>
              </tr>
            ) : (
              trainers.map((trainer: Trainer) => (
                <tr
                  key={trainer.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* الاسم */}
                  <td className="p-2">
                    {editingId === trainer.id ? (
                      <input
                        value={editValues.fullName}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            fullName: e.target.value,
                          })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      trainer.fullName
                    )}
                  </td>

                  {/* رقم الهاتف */}
                  <td className="p-2">
                    {editingId === trainer.id ? (
                      <input
                        value={editValues.phoneNumber}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            phoneNumber: e.target.value,
                          })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      trainer.phoneNumber
                    )}
                  </td>

                  {/* التخصصات */}
                  <td className="p-2">{trainer.specializations?.join(", ")}</td>

                  {/* الإجراءات */}
                  <td className="p-2 flex justify-center gap-2">
                    {editingId === trainer.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(trainer.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                        >
                          حفظ
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                        >
                          إلغاء
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(trainer.id);
                            setEditValues({
                              fullName: trainer.fullName,
                              phoneNumber: trainer.phoneNumber,
                              specializationIds: [],
                            });
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                        >
                          تعديل
                        </button>

                        <button
                          onClick={() => handleDeleteTrainer(trainer.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          حذف
                        </button>
                        <button
                          onClick={() => handleSelectTrainer(trainer.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                          اختيار المدرب
                        </button>
                          <button
                          onClick={() => handleIdTrainer(trainer.id)}
                          className="bg-fuchsia-800 text-white px-3 py-1 rounded hover:bg-fuchsia-500 transition"
                        >
                          المتدربين
                        </button>
                      </>
                    )}
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
          onClick={() => handleSearch(pageIndex - 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400 transition"
        >
          السابق
        </button>

        <span className="px-2 py-2">
          {pageIndex} / {totalPages}
        </span>

        <button
          disabled={pageIndex === totalPages}
          onClick={() => handleSearch(pageIndex + 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400 transition"
        >
          التالي
        </button>
      </div>
    </div>
  );
}

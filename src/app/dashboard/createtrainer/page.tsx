"use client";

import React, { useState } from "react";
import { useTrainer } from "@/context/trainerContext";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function CreateTrainerPage() {
  const { createTrainer, loading } = useTrainer();
  const [selectedSpecializations, setSelectedSpecializations] = useState<number[]>([]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("الاسم مطلوب"),
      phoneNumber: Yup.string()
        .matches(/^01[0-9]{9}$/, "رقم هاتف مصري غير صالح")
        .required("رقم الهاتف مطلوب"),
    }),
    onSubmit: async (values) => {
      await createTrainer({
        ...values,
        specializationIds: selectedSpecializations,
      });
      formik.resetForm();
      setSelectedSpecializations([]);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">إنشاء مدرب جديد</h1>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="الاسم الكامل"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border p-2 rounded"
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <p className="text-red-500">{formik.errors.fullName}</p>
          )}

          <input
            type="text"
            name="phoneNumber"
            placeholder="رقم الهاتف"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border p-2 rounded"
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <p className="text-red-500">{formik.errors.phoneNumber}</p>
          )}

          {/* إدخال التخصصات كأرقام */}
          <label className="font-semibold">اكتب أرقام التخصصات:</label>
          <input
            type="text"
            placeholder="مثال: 2,3,4"
            className="border p-2 rounded"
            value={selectedSpecializations.join(",")}
            onChange={(e) =>
              setSelectedSpecializations(
                e.target.value
                  .split(",")
                  .map((num) => Number(num.trim()))
                  .filter((n) => !isNaN(n))
              )
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-4"
          >
            {loading ? "جارٍ الإرسال..." : "إنشاء مدرب"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMember } from "@/context/memberContext";
import { MemberFormValues, InputFieldProps } from "@/utility/types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateMemberPage() {
  const { createMember, loading } = useMember();

  const formik = useFormik<MemberFormValues>({
  initialValues: {
  fullName: "",
  email: "",
  phoneNumber: "",
  pay: "",
  restMoney: "",
  subscriptionId: "",
},

   validationSchema: Yup.object({
  fullName: Yup.string().required("الاسم مطلوب"),
  email: Yup.string().email("إيميل غير صالح").required("الإيميل مطلوب"),
  phoneNumber: Yup.string()
    .matches(/^01[0-9]{9}$/, "رقم هاتف مصري غير صالح")
    .required("رقم الهاتف مطلوب"),
  pay: Yup.number().typeError("الدفع يجب أن يكون رقم").required("الدفع مطلوب"),
  restMoney: Yup.number().typeError("المتبقي يجب أن يكون رقم").required("المتبقي مطلوب"),
  subscriptionId: Yup.number()
    .typeError("رقم الاشتراك يجب أن يكون رقم")
    .required("رقم الاشتراك مطلوب"),
}),
    onSubmit: async (values) => {
      await createMember(values);
      formik.resetForm();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          إنشاء عضو جديد
        </h1>

        <form onSubmit={formik.handleSubmit} className="grid gap-4">
          <InputField label="الاسم الكامل" name="fullName" value={formik.values.fullName} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.fullName && formik.errors.fullName} />
          <InputField label="البريد الإلكتروني" name="email" type="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.email && formik.errors.email} />
          <InputField label="رقم الهاتف" name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.phoneNumber && formik.errors.phoneNumber} />
          <InputField label="الدفع" name="pay" type="number" value={formik.values.pay} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.pay && formik.errors.pay} />
          <InputField label="المتبقي" name="restMoney" type="number" value={formik.values.restMoney} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.restMoney && formik.errors.restMoney} />
          <InputField label="رقم الاشتراك" name="subscriptionId" type="number" value={formik.values.subscriptionId} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.subscriptionId && formik.errors.subscriptionId} />

          <button type="submit" disabled={loading} className={`mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold shadow-md transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "جارٍ الإرسال..." : "إنشاء عضو"}
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type = "text", value, onChange, onBlur, error }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-1 font-medium text-gray-700">{label}</label>
    <input id={name} name={name} type={type} value={value} onChange={onChange} onBlur={onBlur} className={`border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${error ? "border-red-500" : "border-gray-300"}`} />
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

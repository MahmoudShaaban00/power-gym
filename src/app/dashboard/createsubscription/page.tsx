"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SubscriptionFormValues } from "@/utility/types";
import { Dumbbell, Gift, Calendar, DollarSign } from "lucide-react";

export default function CreateSubscriptionPage() {
  const formik = useFormik<SubscriptionFormValues>({
    initialValues: {
      name: "",
      duration: "",
      phone: "",
      fitnessNumber: "",
      sessionsNumber: 0,
      inviteCount: 0,
      daysPerWeek: 0,
      price: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("الاسم مطلوب"),
      duration: Yup.number().required("المدة مطلوبة").typeError("يجب إدخال رقم"),
      phone: Yup.string()
        .matches(/^01[0-9]{9}$/, "رقم هاتف مصري غير صالح")
        .required("رقم الهاتف مطلوب"),
      fitnessNumber: Yup.number().required("رقم النادي مطلوب").typeError("يجب إدخال رقم"),
      sessionsNumber: Yup.number().required("عدد الجلسات مطلوب").typeError("يجب إدخال رقم"),
      inviteCount: Yup.number().required("عدد الدعوات مطلوب").typeError("يجب إدخال رقم"),
      daysPerWeek: Yup.number().required("عدد الأيام مطلوب").typeError("يجب إدخال رقم"),
      price: Yup.number().required("السعر مطلوب").typeError("يجب إدخال رقم"),
    }),
    onSubmit: (values) => {
      console.log("Subscription Data:", values);
      alert("تم إنشاء الاشتراك بنجاح!");
      formik.resetForm();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
          إنشاء اشتراك جديد
        </h1>

        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput label="الاسم" name="name" icon={<Dumbbell />} formik={formik} />
          <FormInput label="المدة (شهور)" name="duration" type="number" icon={<Calendar />} formik={formik} />
          <FormInput label="رقم الهاتف" name="phone" icon={<Dumbbell />} formik={formik} />
          <FormInput label="رقم النادي" name="fitnessNumber" type="number" icon={<Dumbbell />} formik={formik} />
          <FormInput label="عدد الجلسات" name="sessionsNumber" type="number" icon={<Calendar />} formik={formik} />
          <FormInput label="عدد الدعوات" name="inviteCount" type="number" icon={<Gift />} formik={formik} />
          <FormInput label="عدد الأيام في الأسبوع" name="daysPerWeek" type="number" icon={<Calendar />} formik={formik} />
          <FormInput label="السعر (جنيه)" name="price" type="number" icon={<DollarSign />} formik={formik} />
        </form>

        <button
          type="submit"
          onClick={() => formik.handleSubmit()}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300"
        >
          إنشاء الاشتراك
        </button>
      </div>
    </div>
  );
}

/***************
 * Form Input
 ***************/
function FormInput({
  label,
  name,
  type = "text",
  icon,
  formik,
}: {
  label: string;
  name: keyof SubscriptionFormValues;
  type?: string;
  icon: React.ReactNode;
  formik: any;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-semibold mb-1">{label}</label>
      <div className="relative flex items-center">
        <span className="absolute left-3">{icon}</span>
        <input
          type={type}
          name={name}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border border-gray-300 rounded-xl pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
        />
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-500 text-sm mt-1">{formik.errors[name]}</p>
      )}
    </div>
  );
}

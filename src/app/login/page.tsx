"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Swal from "sweetalert2";
import loginbg from "../../../public/images/loginbackground.jpg";
import { FiMail, FiLock } from "react-icons/fi";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  // ✅ Validation Schema
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("أدخل بريد إلكتروني صالح")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      .required("كلمة المرور مطلوبة"),
  });

  // ✅ دالة تسجيل الدخول
  const loginHandler = async (values: any) => {
    try {
      const { data } = await axios.post(`https://gymadel.runasp.net/api/Account/Login`,values).then((res) => res.data).catch((err) => { throw err; });
      console.log(data);

      // ✅ لو تم تسجيل الدخول بنجاح
      Swal.fire({
        title: "تم تسجيل الدخول بنجاح ✅",
        text: `مرحباً بك يا ${values.email}`,
        icon: "success",
        confirmButtonText: "موافق",
        confirmButtonColor: "#2563eb",
      });

      // ✅ حفظ التوكن في localStorage (اختياري)
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      router.push("/dashboard");
    } catch (err: any) {
      Swal.fire({
        title: "خطأ ❌",
        text: err.response?.data?.message || "فشل تسجيل الدخول، تأكد من البيانات",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // ✅ إعداد Formik
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values, { resetForm }) => {
      loginHandler(values);
      resetForm();
    },
  });

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      {/* ✅ خلفية */}
      <Image
        src={loginbg}
        alt="Background"
        fill
        className="object-cover opacity-80"
        priority
      />

      {/* ✅ بطاقة تسجيل الدخول */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
          تسجيل الدخول
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* البريد الإلكتروني */}
          <div>
            <label className="mb-1 block font-medium text-gray-200">
              البريد الإلكتروني
            </label>
            <div className="flex items-center rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm focus-within:ring-2 focus-within:ring-indigo-400">
              <FiMail className="ml-3 text-indigo-300 text-xl" />
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full rounded-r-lg px-3 py-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="mt-1 text-sm text-red-400">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="mb-1 block font-medium text-gray-200">
              كلمة المرور
            </label>
            <div className="flex items-center rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm focus-within:ring-2 focus-within:ring-indigo-400">
              <FiLock className="ml-3 text-indigo-300 text-xl" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full rounded-r-lg px-3 py-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="mt-1 text-sm text-red-400">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* زر الدخول */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50"
          >
            {formik.isSubmitting ? "جارٍ الإرسال..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

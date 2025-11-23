"use client";

import React from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Swal from "sweetalert2";
import loginbg from "../../../public/images/loginbackground.jpg";
import { FiMail, FiLock } from "react-icons/fi";
import { useRouter } from "next/navigation";
import axios from "axios";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("أدخل بريد إلكتروني صالح")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      .required("كلمة المرور مطلوبة"),
  });

  const loginHandler = async (values: LoginFormValues) => {
    try {
      const { data } = await axios.post(
        `https://gymadel.runasp.net/api/Account/Login`,
        values
      );

      // التوكن موجود داخل data.data.token
      if (data?.data?.token) {
        localStorage.setItem("token", data.data.token);

        Swal.fire({
          title: "تم تسجيل الدخول بنجاح ✅",
          text: `مرحباً بك يا ${data.data.email}`,
          icon: "success",
          confirmButtonText: "موافق",
          confirmButtonColor: "#2563eb",
        }).then(() => {
          router.push("/dashboard");
        });
      } else {
        Swal.fire({
          title: "خطأ ❌",
          text: "لم يتم استلام التوكن من السيرفر",
          icon: "error",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        Swal.fire({
          title: "خطأ ❌",
          text: err.response?.data?.message || "فشل تسجيل الدخول، تأكد من البيانات",
          icon: "error",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#ef4444",
        });
      } else {
        Swal.fire({
          title: "خطأ ❌",
          text: "حدث خطأ غير متوقع",
          icon: "error",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const formik = useFormik<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values: LoginFormValues, { resetForm }: FormikHelpers<LoginFormValues>) => {
      loginHandler(values);
      resetForm();
    },
  });

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      <Image
        src={loginbg}
        alt="Background"
        fill
        className="object-cover opacity-80"
        priority
      />

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
          تسجيل الدخول
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block font-medium text-gray-200">البريد الإلكتروني</label>
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
              <div className="mt-1 text-sm text-red-400">{formik.errors.email}</div>
            )}
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-200">كلمة المرور</label>
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
              <div className="mt-1 text-sm text-red-400">{formik.errors.password}</div>
            )}
          </div>

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

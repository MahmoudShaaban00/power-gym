"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AttendanceContextType } from "@/utility/types";

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  // ❗ تسجيل الحضور
  const markAttendance = async (memberId: string, token: string) => {
    if (!memberId || !token) {
      toast.error("رقم العضو أو التوكن غير موجود");
      return;
    }

    setLoading(true);
    try {
      const body = { date: new Date().toISOString() };

      await axios.post(
        `https://gymadel.runasp.net/api/Attendence/MarkAttendence/${memberId}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("تم تسجيل الحضور بنجاح!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        toast.error(error.response?.data || "فشل في تسجيل الحضور");
      } else {
        console.error("خطأ غير متوقع", error);
        toast.error("حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  // ❗ حذف حضور عضو
  const deleteAttendance = async (memberId: string, dayDate: string, token: string) => {
    if (!memberId || !dayDate || !token) {
      toast.error("يوجد بيانات ناقصة (رقم العضو، التاريخ أو التوكن)");
      return;
    }

    setLoading(true);
    try {
      await axios.delete(
        `https://gymadel.runasp.net/api/Attendence/RemoveAttendence/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            DayDate: dayDate,
          },
        }
      );

      toast.success("تم حذف الحضور بنجاح!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("خطأ أثناء حذف الحضور:", error);
        toast.error(error.response?.data || "فشل في حذف الحضور");
      } else {
        console.error("خطأ غير متوقع", error);
        toast.error("حدث خطأ غير متوقع");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ❗ الحصول على حضور عضو
  const getMemberAttendances = async (memberId: string, token: string) => {
    if (!memberId || !token) return [];

    setLoading(true);
    try {
      const response = await axios.get(
        `https://gymadel.runasp.net/api/Attendence/GetMemberAttendences/${memberId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const dayDates: string[] = response.data?.data?.dayDate || [];

      return dayDates.map((date) => ({
        id: date,
        memberId,
        date,
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return [];
        }
        console.error("خطأ أثناء جلب الحضور:", error);
      } else {
        console.error("خطأ غير متوقع:", error);
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        loading,
        markAttendance,
        deleteAttendance,
        getMemberAttendances,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context)
    throw new Error("useAttendance يجب استخدامه داخل AttendanceProvider");
  return context;
};

"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Attendance {
  id: string;
  memberId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
}

interface AttendanceContextType {
  loading: boolean;
  markAttendance: (memberId: string, token: string) => Promise<void>;
  deleteAttendance: (memberId: string, dayDate: string, token: string) => Promise<void>;
  getMemberAttendances: (memberId: string, token: string) => Promise<Attendance[]>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  // MARK ATTENDANCE
  const markAttendance = async (memberId: string, token: string) => {
    if (!memberId || !token) {
      toast.error("Member ID or token missing");
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

      toast.success("Attendance marked successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  // DELETE ATTENDANCE
  const deleteAttendance = async (memberId: string, dayDate: string, token: string) => {
    if (!memberId || !dayDate || !token) {
      toast.error("Missing (memberId, date, or token)");
      return;
    }

    setLoading(true);
    try {
      await axios.delete(
        `https://gymadel.runasp.net/api/Attendence/RemoveAttendence/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            DayDate: dayDate, // API requires this header
          },
        }
      );

      toast.success("Attendance deleted!");
    } catch (error: any) {
      console.error("Error deleting attendance:", error);
      toast.error(error.response?.data || "Failed to delete attendance");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // GET MEMBER ATTENDANCE
  // GET MEMBER ATTENDANCE
const getMemberAttendances = async (memberId: string, token: string) => {
  if (!memberId || !token) return [];

  setLoading(true);
  try {
    const response = await axios.get(
      `https://gymadel.runasp.net/api/Attendence/GetMemberAttendences/${memberId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Attendances response:", response.data);

    const dayDates: string[] = response.data?.data?.dayDate || [];

    return dayDates.map(date => ({
      id: date,
      memberId,
      date,
    }));
  } catch (error: any) {
    // API returns 404 when empty → treat as empty list
    if (error.response?.status === 404) {
      return [];
    }

    console.error("Error fetching attendances:", error);
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
    throw new Error("useAttendance must be used within an AttendanceProvider");
  return context;
};

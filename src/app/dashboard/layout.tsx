"use client";

import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/SideBar/SideBar";
import { SubscriptionProvider } from "../../context/subscriptionContext";
import { MemberProvider } from "../../context/memberContext";
import { AttendanceProvider } from "../../context/attendenceContext";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Navbar فوق */}
      <Navbar />

      <div className="flex flex-1">
        {/* ✅ Sidebar شمال */}
        <Sidebar />

        {/* ✅ المحتوى بيتغير حسب الـ route */}
        <main className="flex-1 bg-gray-100 p-6">
          <SubscriptionProvider>
            <MemberProvider>
              <AttendanceProvider>
                {children}
              </AttendanceProvider>
            </MemberProvider>
          </SubscriptionProvider>
        </main>
      </div>
    </div>
  );
}

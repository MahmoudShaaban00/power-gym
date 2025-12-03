"use client";

import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/SideBar/SideBar";
import ProtectedRoute from "../../components/ProtectedRouted/ProtectedRouted";

import { SubscriptionProvider } from "../../context/subscriptionContext";
import { MemberProvider } from "../../context/memberContext";
import { AttendanceProvider } from "../../context/attendenceContext";
import { SpecializationProvider } from "../../context/specializationContext";
import { TrainerContextProvider } from "../../context/trainerContext";
import { OwnerProvider } from "../../context/ownerContext";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* NAVBAR */}
        <Navbar />

        <div className="flex flex-1">
          {/* SIDEBAR */}
          <Sidebar />

          {/* CONTENT */}
          <main className="flex-1 bg-gray-100 p-6">
            <SubscriptionProvider>
              <MemberProvider>
                <AttendanceProvider>
                  <SpecializationProvider>
                    <TrainerContextProvider>
                      <OwnerProvider >
                      <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                      />

                      {children}
                      </OwnerProvider>
                    </TrainerContextProvider>
                  </SpecializationProvider>
                </AttendanceProvider>
              </MemberProvider>
            </SubscriptionProvider>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

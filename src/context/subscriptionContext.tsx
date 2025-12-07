"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Subscription, SubscriptionFormValues, SubscriptionContextType } from "@/utility/types";

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);

  const baseUrl = "https://gymadel.runasp.net/api/Subscription";

  // ===========================
  //            GET
  // ===========================
  const getAllSubscription = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/GetSubscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const subscriptions: Subscription[] = data?.data || [];
      setAllSubscriptions(subscriptions);
      setTotalSubscriptions(subscriptions.length);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      toast.error("فشل جلب الاشتراكات");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  //          CREATE
  // ===========================
  const createSubscription = async (values: SubscriptionFormValues) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      await axios.post(`${baseUrl}/CreateSubscription`, values, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      toast.success("تم إنشاء الاشتراك بنجاح!");
      await getAllSubscription();
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error( "حدث خطأ أثناء إنشاء الاشتراك");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  //          UPDATE
  // ===========================
  const updateSubscription = async (id: number, values: SubscriptionFormValues) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      await axios.put(`${baseUrl}/UpdateSubscription/${id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("تم تحديث الاشتراك بنجاح!");
      await getAllSubscription();
    } catch (err) {
      console.error("Error updating subscription:", err);
      toast.error("حدث خطأ أثناء تحديث الاشتراك");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  //          DELETE
  // ===========================
  const deleteSubscription = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      await axios.delete(`${baseUrl}/DeleteSubscription/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("تم حذف الاشتراك بنجاح!");
      await getAllSubscription();
    } catch (err) {
      console.error("Error deleting subscription:", err);
      toast.error("حدث خطأ أثناء حذف الاشتراك");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        allSubscriptions,
        getAllSubscription,
        createSubscription,
        updateSubscription,
        deleteSubscription,
        loading,
        totalSubscriptions,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error("useSubscription must be used within SubscriptionProvider");
  return context;
};

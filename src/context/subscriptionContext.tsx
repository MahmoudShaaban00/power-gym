"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { SubscriptionFormValues , SubscriptionContextType } from "@/utility/types";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [allSubscriptions, setAllSubscriptions] = useState<SubscriptionFormValues[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);

  const baseUrl = "https://gymadel.runasp.net/api/Subscription";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

 const getAllSubscription = async () => {
  setLoading(true);
  try {
    const { data } = await axios.get(`${baseUrl}/GetSubscriptions`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // تأكد من الوصول إلى array
    const subscriptions = Array.isArray(data) ? data : data.data || [];
    setAllSubscriptions(subscriptions);
    setTotalSubscriptions(subscriptions.length);
    console.log("Fetched Subscriptions:", subscriptions);
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
  } finally {
    setLoading(false);
  }
};


const createSubscription = async (values: SubscriptionFormValues) => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    await axios.post(`${baseUrl}/CreateSubscription`, values, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    // جلب البيانات المحدثة من السيرفر
    await getAllSubscription();

    toast.success("تم إنشاء الاشتراك بنجاح!");
  } catch (err: any) {
    console.error("Error creating subscription:", err.response || err);
    toast.error(err.response?.data?.message || "حدث خطأ أثناء إنشاء الاشتراك");
  } finally {
    setLoading(false);
  }
};



  const updateSubscription = async (id: number, values: SubscriptionFormValues) => {
    setLoading(true);
    try {
      await axios.put(`${baseUrl}/UpdateSubscription/${id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await getAllSubscription();
    } catch (err) {
      console.error("Error updating subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscription = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`${baseUrl}/DeleteSubscription/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await getAllSubscription();
    } catch (err) {
      console.error("Error deleting subscription:", err);
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

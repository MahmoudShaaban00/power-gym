"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { SubscriptionFormValues } from "@/utility/types";

interface SubscriptionContextType {
  allSubscriptions: SubscriptionFormValues[];
  getAllSubscription: () => Promise<void>;
  createSubscription: (values: SubscriptionFormValues) => Promise<void>;
  updateSubscription: (id: number, values: SubscriptionFormValues) => Promise<void>;
  deleteSubscription: (id: number) => Promise<void>;
  loading: boolean;
  totalSubscriptions: number;
}

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

      const subscriptions = Array.isArray(data) ? data : data.data || [];
      setAllSubscriptions(subscriptions);
      setTotalSubscriptions(subscriptions.length);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (values: SubscriptionFormValues) => {
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/CreateSubscription`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await getAllSubscription();
    } catch (err) {
      console.error("Error creating subscription:", err);
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

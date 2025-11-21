"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MemberFormValues , MemberContextType , Member } from "@/utility/types";



const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);

  const baseUrl = "https://gymadel.runasp.net/api/Member";

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const createMember = async (values: MemberFormValues) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${baseUrl}/CreateMember`, values, { headers: authHeader() });
      toast.success("Member created successfully!");
      setMembers(prev => [...prev, data]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error creating member");
    } finally {
      setLoading(false);
    }
  };

  const getMembers = async (subscriptionId: string, pageSize: number, pageIndex: number) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/GetMembers?SubscriptionId=${subscriptionId}&pageSize=${pageSize}&pageIndex=${pageIndex}`,
        { headers: authHeader() }
      );

      const realMembers = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];
      setMembers(realMembers);

      const total = res.data?.data?.count || 0; // correct total
      setTotalCount(total);
      setTotalMembers(total);
      setTotalPages(Math.ceil(total / pageSize));
    } catch {
      toast.error("Error fetching members");
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`${baseUrl}/DeleteMember/${id}`, { headers: authHeader() });
      toast.success("Member deleted!");
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch {
      toast.error("Error deleting member");
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (id: string, values: MemberFormValues) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`${baseUrl}/UpdateMember/${id}`, values, { headers: authHeader() });
      setMembers(prev => prev.map(m => (m.id === id ? { ...m, ...data } : m)));
      toast.success("Member updated successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MemberContext.Provider
      value={{ createMember, getMembers, deleteMember, updateMember, members, loading, totalPages, totalCount, totalMembers }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = () => {
  const context = useContext(MemberContext);
  if (!context) throw new Error("useMember must be used within MemberProvider");
  return context;
};

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MemberFormValues, Member,ExpiryData ,MemberContextType   } from "@/utility/types";




const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [expiryMap, setExpiryMap] = useState<{ [memberId: string]: ExpiryData | null }>({});

  const baseUrl = "https://gymadel.runasp.net/api/Member";

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // --------------------------
  // Create Member
  // --------------------------
  const createMember = async (values: MemberFormValues) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${baseUrl}/CreateMember`, values, { headers: authHeader() });
      toast.success("تم إنشاء العضو بنجاح!");
      setMembers(prev => [...prev, data]);
    } catch (err: unknown) {
      console.error(err);
      toast.error("حدث خطأ أثناء إنشاء العضو");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Get Members
  // --------------------------
  const getMembers = async (subscriptionId: string, pageSize: number, pageIndex: number) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/GetMembers?SubscriptionId=${subscriptionId}&pageSize=${pageSize}&pageIndex=${pageIndex}`,
        { headers: authHeader() }
      );
      const realMembers = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];
      setMembers(realMembers);

      const total = res.data?.data?.count || 0;
      setTotalCount(total);
      setTotalMembers(total);
      setTotalPages(Math.ceil(total / pageSize));
    } catch (err) {
      console.error(err);
      toast.error("فشل في جلب الأعضاء");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Delete Member
  // --------------------------
  const deleteMember = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`${baseUrl}/DeleteMember/${id}`, { headers: authHeader() });
      toast.success("تم حذف العضو!");
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch {
      toast.error("فشل في حذف العضو");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Update Member
  // --------------------------
  const updateMember = async (id: string, values: MemberFormValues) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`${baseUrl}/UpdateMember/${id}`, values, { headers: authHeader() });
      setMembers(prev => prev.map(m => (m.id === id ? { ...m, ...data } : m)));
      toast.success("تم تحديث العضو بنجاح!");
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحديث العضو");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Get Expiry Member
  // --------------------------
  const getExpiryMember = async (memberId: string): Promise<ExpiryData | null> => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/${memberId}/ExpirySessionsAndDate`, { headers: authHeader() });
      const expiryData = data?.data?.[0] ?? null;
      setExpiryMap(prev => ({ ...prev, [memberId]: expiryData }));
      return expiryData;
    } catch (err) {
      console.error(err);
      toast.error("فشل في جلب تاريخ انتهاء الاشتراك");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MemberContext.Provider
      value={{
        createMember,
        getMembers,
        deleteMember,
        updateMember,
        members,
        loading,
        totalPages,
        totalCount,
        totalMembers,
        getExpiryMember,
        expiryMap,
      }}
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

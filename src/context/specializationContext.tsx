import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Specialization, SpecializationContextType } from "@/utility/types";

const SpecializationContext = createContext<SpecializationContextType | undefined>(undefined);

export const SpecializationProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const API = "https://gymadel.runasp.net/api/Specialization";

  const getSpecializations = useCallback(async (token: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/GetSpecializations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpecializations(res.data.data || []);
    } catch {
    toast.error("Failed to fetch specializations");
  } finally {
    setLoading(false);
  }
}, []);

  const createSpecialization = useCallback(async (name: string, token: string) => {
    try {
      setLoading(true);
      await axios.post(`${API}/CreateSpecialization`, { name }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم اتشاء متخصص بنجاح!");
      await getSpecializations(token);
    } finally {
      setLoading(false);
    }
  }, [getSpecializations]);

  const updateSpecialization = useCallback(async (id: string, name: string, token: string) => {
    try {
      setLoading(true);
      await axios.put(`${API}/UpdateSpecialization/${id}`, { name }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم التحديث بنجاح!");
      await getSpecializations(token);
    } finally {
      setLoading(false);
    }
  }, [getSpecializations]);

  const deleteSpecialization = useCallback(async (id: string, token: string) => {
    try {
      setLoading(true);
      await axios.delete(`${API}/DeleteSpecialization/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم الحذف بنجاح!");
      await getSpecializations(token);
    } finally {
      setLoading(false);
    }
  }, [getSpecializations]);

  return (
    <SpecializationContext.Provider
      value={{ loading, specializations, getSpecializations, createSpecialization, updateSpecialization, deleteSpecialization }}
    >
      {children}
    </SpecializationContext.Provider>
  );
};

export const useSpecialization = () => {
  const context = useContext(SpecializationContext);
  if (!context) throw new Error("useSpecialization must be used inside SpecializationProvider");
  return context;
};

"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trainer, TrainerContextType } from "@/utility/types";
import { TrainerFormValues, TrainerFilter } from "@/utility/types";

const TrainerContext = createContext<TrainerContextType | undefined>(undefined);

export const TrainerContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalTrainers, setTotalTrainers] = useState(0);

  const baseUrl = "https://gymadel.runasp.net/api/Trainer";

  // =============================
  // 🔵 Create Trainer
  // =============================
  const createTrainer = async (values: TrainerFormValues): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("يجب تسجيل الدخول أولا");
      throw new Error("Unauthorized");
    }

    try {
      setLoading(true);

      const response = await axios.post(`${baseUrl}/CreateTrainer`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("تم إضافة المدرب بنجاح");
      await getTrainers({ specializationId: 0, pageSize: 10, pageIndex: 1, search: "" });
      console.log(response.data);

    } catch (error) {
      console.error(error);
      toast.error("فشل إنشاء المدرب");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔵 Get Trainers
  // =============================
  const getTrainers = async (filters: TrainerFilter): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("يجب تسجيل الدخول أولا");
      throw new Error("Unauthorized");
    }

    try {
      setLoading(true);

      const response = await axios.get(`${baseUrl}/GetTrainers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          SpecializationId: filters.specializationId,
          pageSize: filters.pageSize,
          pageIndex: filters.pageIndex,
          search: filters.search,
        },
      });

      const trainerList = response.data.data?.data || [];
      setTrainers(trainerList);
      setTotalCount(response.data.data?.count || trainerList.length);
      setTotalTrainers(trainerList.length);
      console.log(response)
      

    } catch (error) {
      console.error(error);
      toast.error("فشل تحميل المدربين");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔵 Update Trainer
  // =============================
  const updateTrainer = async (id: string, values: TrainerFormValues): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("يجب تسجيل الدخول أولا");
      throw new Error("Unauthorized");
    }

    try {
      setLoading(true);

      await axios.put(`${baseUrl}/UpdateTrainer/${id}`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("تم تحديث المدرب بنجاح");
      await getTrainers({ specializationId: 0, pageSize: 10, pageIndex: 1, search: "" });

    } catch (error) {
      console.error(error);
      toast.error("فشل تحديث المدرب");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔵 Delete Trainer
  // =============================
  const deleteTrainer = async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("يجب تسجيل الدخول أولا");
      throw new Error("Unauthorized");
    }

    try {
      setLoading(true);

      await axios.delete(`${baseUrl}/DeleteTrainer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("تم حذف المدرب بنجاح");
      setTrainers((prev) => prev.filter((t) => t.id !== id));
      setTotalCount((prev) => prev - 1);

    } catch (error) {
      console.error(error);
      toast.error("فشل حذف المدرب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainerContext.Provider
      value={{
        trainers,
        loading,
        totalCount,
        getTrainers,
        createTrainer,
        updateTrainer,
        deleteTrainer,
        totalTrainers,
      }}
    >
      {children}
    </TrainerContext.Provider>
  );
};

// =============================
// Hook
// =============================
export const useTrainer = () => {
  const context = useContext(TrainerContext);
  if (!context) throw new Error("useTrainer must be used within TrainerContextProvider");
  return context;
};

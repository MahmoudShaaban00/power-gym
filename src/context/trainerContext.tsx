"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trainer, TrainerContextType, Trainee } from "@/utility/types";
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
      await axios.post(`${baseUrl}/CreateTrainer`, values, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      toast.success("تم إضافة المدرب بنجاح");
      await getTrainers({ specializationId: 0, pageSize: 10, pageIndex: 1, search: "" });
    } catch (error: unknown) {
      handleAxiosError(error, "فشل إنشاء المدرب");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔵 Get Trainers
  // =============================
  const getTrainers = async (filters: TrainerFilter): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

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
    } catch (error: unknown) {
      handleAxiosError(error, "فشل تحميل المدربين");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔵 Update Trainer
  // =============================
  const updateTrainer = async (id: string, values: TrainerFormValues): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    try {
      setLoading(true);
      await axios.put(`${baseUrl}/UpdateTrainer/${id}`, values, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      toast.success("تم تحديث المدرب بنجاح");
      await getTrainers({ specializationId: 0, pageSize: 10, pageIndex: 1, search: "" });
    } catch (error: unknown) {
      handleAxiosError(error, "فشل تحديث المدرب");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔵 Delete Trainer
  // =============================
  const deleteTrainer = async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    try {
      setLoading(true);
      await axios.delete(`${baseUrl}/DeleteTrainer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم حذف المدرب بنجاح");
      setTrainers((prev) => prev.filter((t) => t.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (error: unknown) {
      handleAxiosError(error, "فشل حذف المدرب");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔵 Add Trainee to Trainer
  // =============================
  const addTraineeToTrainer = async (trainerId: string, traineeId: string): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    try {
      setLoading(true);
      await axios.post(`${baseUrl}/${trainerId}/AddTrainee/${traineeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم إضافة المتدرب للمدرب بنجاح");
    } catch (error: unknown) {
      handleAxiosError(error, "فشل إضافة المتدرب");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔵 Get Trainees of Specific Trainer
  // =============================
  const getTraineesOfTrainer = async (
    trainerId: string,
    search: string = "",
    pageIndex: number = 1,
    pageSize: number = 5
  ): Promise<{ data: Trainee[]; count: number } | null> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    try {
      setLoading(true);

      const response = await axios.get(
        `${baseUrl}/${trainerId}/GetTraineesToSpecificTrainer`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { Search: search, PageIndex: pageIndex, PageSize: pageSize },
        }
      );

      const traineesData = response.data.data?.data || [];
      const count = response.data.data?.count ?? 0;

      return { data: traineesData, count };

    } catch (error: unknown) {
  // لو الـ error من Axios
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const count = error.response?.data?.data?.count;

    // trainer مفيهوش trainees → مفيش toast
    if (status === 404 || count === 0) {
      return { data: [], count: 0 };
    }
  }

  // أي error حقيقي → يظهر toast
  handleAxiosError(error, "فشل جلب المتدربين");
  return null;
}

  };

  // =============================
  // 🔵 Delete Trainee from Trainer
  // =============================
  const deleteTraineeFromTrainer = async (trainerId: string, traineeId: string) => {
    const token = localStorage.getItem("token");
    if (!trainerId || !token) return;

    try {
      setLoading(true);
      await axios.delete(`${baseUrl}/${trainerId}/DeleteTrainee/${traineeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم حذف المتدرب من المدرب بنجاح");
    } catch (error: unknown) {
      handleAxiosError(error, "فشل حذف المتدرب");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔵 Helper: Handle Axios Errors
  // =============================
  const handleAxiosError = (error: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message;

      // 🚫 منع ظهور Toast لما يكون Success
      if (msg === "Success") return;

      toast.error(msg || defaultMessage);
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(defaultMessage);
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
        addTraineeToTrainer,
        getTraineesOfTrainer,
        deleteTraineeFromTrainer,
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

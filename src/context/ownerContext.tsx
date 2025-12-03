"use client";

import React, { createContext, useContext, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

// =====================
// TYPES
// =====================

export interface EmployeePayload {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  role: "Admin" | "Employee";
}

export interface Owner {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "Admin" | "Employee";
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  succeeded?: boolean;
  statusCode?: number;
}

interface OwnerContextType {
  loading: boolean;
  createEmployee: (data: EmployeePayload) => Promise<void>;
  getOwners: () => Promise<Owner[]>;
  deleteOwner: (id: string) => Promise<boolean>;
  updateOwner: (owner: Owner) => Promise<boolean>;
}

// =====================
// CONTEXT
// =====================

const OwnerContext = createContext<OwnerContextType | null>(null);

export const OwnerProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // -----------------------------
  // CREATE EMPLOYEE
  // -----------------------------
  const createEmployee = async (data: EmployeePayload): Promise<void> => {
    if (!token) {
      toast.error("Unauthorized: No token found");
      return;
    }
    try {
      setLoading(true);
      await axios.post<ApiResponse<null>>(
        "https://gymadel.runasp.net/api/Account/create-employee",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Employee created successfully!");
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      toast.error(error.response?.data?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // GET OWNERS
  // -----------------------------
  const getOwners = async (): Promise<Owner[]> => {
    if (!token) {
      toast.error("Unauthorized: No token found");
      return [];
    }
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<Owner[]>>(
        "https://gymadel.runasp.net/api/Account/GetOwners",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data || [];
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      toast.error(error.response?.data?.message || "Failed to fetch owners");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // DELETE OWNER
  // -----------------------------
  const deleteOwner = async (id: string): Promise<boolean> => {
    if (!token) {
      toast.error("Unauthorized: No token found");
      return false;
    }
    try {
      setLoading(true);
      await axios.delete<ApiResponse<null>>(
        `https://gymadel.runasp.net/api/Account/DeleteOwner/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Owner deleted successfully!");
      return true;
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      toast.error(error.response?.data?.message || "Failed to delete owner");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UPDATE OWNER
  // -----------------------------
  const updateOwner = async (owner: Owner): Promise<boolean> => {
    if (!token) {
      toast.error("Unauthorized: No token found");
      return false;
    }
    try {
      setLoading(true);
      await axios.put<ApiResponse<null>>(
        `https://gymadel.runasp.net/api/Account/UpdateOwner/${owner.id}`,
        owner,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Owner updated successfully!");
      return true;
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      toast.error(error.response?.data?.message || "Failed to update owner");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OwnerContext.Provider
      value={{ loading, createEmployee, getOwners, deleteOwner, updateOwner }}
    >
      {children}
    </OwnerContext.Provider>
  );
};

export const useOwner = () => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error("useOwner must be used inside OwnerProvider");
  }
  return context;
};

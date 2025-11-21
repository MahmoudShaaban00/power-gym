"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Specialization,SpecializationContextType  } from "@/utility/types";



const SpecializationContext = createContext<SpecializationContextType | undefined>(undefined);

export const SpecializationProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  const API = "https://gymadel.runasp.net/api/Specialization";

  // ===========================
  //          GET
  // ===========================
  const getSpecializations = async (token: string) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/GetSpecializations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSpecializations(res.data.data || []);
      toast.success("Specializations fetched successfully!");
      console.log(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch specializations");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  //          CREATE
  // ===========================
  const createSpecialization = async (name: string, token: string) => {
    try {
      setLoading(true);

      await axios.post(
        `${API}/CreateSpecialization`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Specialization created successfully!");
      await getSpecializations(token);
    } catch (error) {
      toast.error("Failed to create specialization");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  //          UPDATE
  // ===========================
  const updateSpecialization = async (id: string, name: string, token: string) => {
    try {
      setLoading(true);

      await axios.put(
        `${API}/UpdateSpecialization/${id}`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Updated successfully!");
      await getSpecializations(token);
    } catch (error) {
      toast.error("Failed to update specialization");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  //          DELETE
  // ===========================
  const deleteSpecialization = async (id: string, token: string) => {
    try {
      setLoading(true);

      await axios.delete(`${API}/DeleteSpecialization/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Deleted successfully!");
      await getSpecializations(token);
    } catch (error) {
      toast.error("Failed to delete specialization");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpecializationContext.Provider
      value={{
        loading,
        specializations,
        getSpecializations,
        createSpecialization,
        updateSpecialization,
        deleteSpecialization,
      }}
    >
      {children}
    </SpecializationContext.Provider>
  );
};

export const useSpecialization = () => {
  const context = useContext(SpecializationContext);
  if (!context) {
    throw new Error("useSpecialization must be used inside SpecializationProvider");
  }
  return context;
};

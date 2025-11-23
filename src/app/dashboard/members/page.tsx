"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Member } from "@/utility/types";

export default function Page() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMembers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "https://gymadel.runasp.net/api/Member/GetMembersWithoutPagination",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // API returns: { succeeded, message, data: [] }
      setMembers(res.data.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-lg font-semibold">
        ⏳ جارٍ تحميل الأعضاء...
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold mb-4 text-blue-600">
        👥 الأعضاء المسجلين
      </h2>

      <p className="text-gray-700 mb-6">
        يمكنك هنا عرض وإدارة جميع الأعضاء المسجلين في الجيم.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 shadow-md rounded-lg overflow-hidden text-sm">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="px-4 py-3">الاسم</th>
              <th className="px-4 py-3">رقم الهاتف</th>
              <th className="px-4 py-3">البريد الإلكتروني</th>
            </tr>
          </thead>

          <tbody>
            {members.length > 0 ? (
              members.map((member:Member, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition-all border-b"
                >
                  <td className="px-4 py-3 font-medium">{member.fullName}</td>
                  <td className="px-4 py-3">{member.phoneNumber}</td>
                  <td className="px-4 py-3">{member.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-3 text-center text-gray-500"
                  colSpan={3}
                >
                  لا يوجد أعضاء.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

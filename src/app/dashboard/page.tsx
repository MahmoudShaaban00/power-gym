"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";

interface Member {
  id: string;
  name: string;
  pay: number;
  restMoney: number;
}

interface Subscription {
  id: string;
  name: string;
  duration: number;
  price: number;
  fitnessNumber: number;
  sessionsNumber: number;
  inviteCount: number;
  daysPerWeek: number;
}

interface Specialization {
  id: string;
  name: string;
}

interface BarData {
  category: string;
  value: number;
  [key: string]: string | number;
}

export default function DashboardPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [payRestChartData, setPayRestChartData] = useState<BarData[]>([]);

  const token = localStorage.getItem("token");

  // دالة لجلب كل الأعضاء
  const getAllMembers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `https://gymadel.runasp.net/api/Member/GetMembers?pageSize=1000&pageIndex=1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const realMembers = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];
      setMembers(realMembers);
    } catch (err) {
      console.error("Error fetching all members", err);
    }
  }, [token]);

  // دالة لجلب كل الاشتراكات
  const getAllSubscriptions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `https://gymadel.runasp.net/api/Subscription/GetSubscriptions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const subs = Array.isArray(res.data?.data) ? res.data.data : [];
      setSubscriptions(subs);
    } catch (err) {
      console.error("Error fetching subscriptions", err);
    }
  }, [token]);

  // دالة لجلب كل التخصصات
  const getAllSpecializations = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `https://gymadel.runasp.net/api/Specialization/GetSpecializations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const specs = Array.isArray(res.data?.data) ? res.data.data : [];
      setSpecializations(specs);
    } catch (err) {
      console.error("Error fetching specializations", err);
    }
  }, [token]);

  useEffect(() => {
    getAllMembers();
    getAllSubscriptions();
    getAllSpecializations();
  }, [getAllMembers, getAllSubscriptions, getAllSpecializations]);

  useEffect(() => {
    const totalPayed = members.reduce((acc, m) => acc + Number(m.pay), 0);
    const totalRemaining = members.reduce((acc, m) => acc + Number(m.restMoney), 0);

    setPayRestChartData([
      { category: "Paid", value: totalPayed },
      { category: "Remaining", value: totalRemaining },
    ]);
  }, [members]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">لوحة التحكم</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700">الأعضاء</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{members.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700">الاشتراكات</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{subscriptions.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700">التخصصات</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">{specializations.length}</p>
        </div>
      </div>

      {/* Charts Side by Side on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="w-full h-[400px] bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-center">Total Paid vs Remaining</h2>
          <ResponsiveBar
            data={payRestChartData}
            keys={["value"]}
            indexBy="category"
            margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={{ scheme: "nivo" }}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Category",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Value",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            animate={true}
            motionConfig="gentle"
          />
        </div>

        {/* Pie Chart */}
        <div className="w-full h-[400px] bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-center">Total Distribution</h2>
          <ResponsivePie
            data={[
              { id: "Members", value: members.length },
              { id: "Subscriptions", value: subscriptions.length },
              { id: "Specializations", value: specializations.length },
            ]}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          />
        </div>
      </div>
    </div>
  );
}

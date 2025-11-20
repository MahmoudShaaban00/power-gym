"use client";

import React, { useEffect, useState } from "react";
import { useMember } from "@/context/memberContext";
import { useSubscription } from "@/context/subscriptionContext";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";

export default function DashboardPage() {
  const { members, getMembers, totalMembers } = useMember();
  const { getAllSubscription, totalSubscriptions } = useSubscription();

  const [phoneChartData, setPhoneChartData] = useState<any[]>([]);
  const [payRestChartData, setPayRestChartData] = useState<any[]>([]);

  const pageSize = 1000; // لجلب كل الأعضاء مرة واحدة
  const subscriptionId = ""; // ممكن تختار اشتراك محدد أو تركه فارغ

  useEffect(() => {
    getMembers(subscriptionId, pageSize, 1);
    getAllSubscription();
  }, []);

  useEffect(() => {
    // تجميع الأعضاء حسب بادئة رقم الهاتف
    const phoneCounts: Record<string, number> = {};
    members.forEach(m => {
      const prefix = m.phoneNumber.slice(0, 3); // 010, 011, 012, 015
      phoneCounts[prefix] = (phoneCounts[prefix] || 0) + 1;
    });

    const phoneData = Object.entries(phoneCounts).map(([prefix, count]) => ({
      id: prefix,
      label: prefix,
      value: count
    }));

    setPhoneChartData(phoneData);

    // بيانات pay vs restMoney
    const totalPay = members.reduce((sum, m) => sum + Number(m.pay), 0);
    const totalRest = members.reduce((sum, m) => sum + Number(m.restMoney), 0);

    setPayRestChartData([
      { category: "Paid", value: totalPay },
      { category: "Remaining", value: totalRest }
    ]);

  }, [members]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Total Members</h2>
          <p className="text-2xl">{totalMembers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Total Subscriptions</h2>
          <p className="text-2xl">{totalSubscriptions}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow h-[400px]">
          <h2 className="text-xl font-bold mb-4 text-center">Members by Phone Prefix</h2>
          <ResponsivePie
            data={phoneChartData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: "nivo" }}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            enableArcLinkLabels={true}
            arcLinkLabelsTextColor="#333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            enableArcLabels={true}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow h-[400px]">
          <h2 className="text-xl font-bold mb-4 text-center">Total Paid vs Remaining</h2>
          <ResponsiveBar
            data={payRestChartData}
            keys={["value"]}
            indexBy="category"
            margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
            padding={0.3}
            colors={{ scheme: "paired" }}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
            axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          />
        </div>
      </div>
    </div>
  );
}

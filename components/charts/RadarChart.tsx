"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function OpportunityRadarChart({
  data,
}: {
  data: {
    market: number;
    innovation: number;
    scalability: number;
    competition: number;
    execution: number;
    revenue: number;
    technology: number;
  };
}) {
  const chart = [
    { subject: "Market", value: data.market },
    { subject: "Innovation", value: data.innovation },
    { subject: "Scalability", value: data.scalability },
    { subject: "Competition", value: data.competition },
    { subject: "Execution", value: data.execution },
    { subject: "Revenue", value: data.revenue },
    { subject: "Technology", value: data.technology },
  ];

  return (
    <ResponsiveContainer width="100%" height={450}>
      <RechartsRadarChart data={chart}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#cbd5e1", fontSize: 14 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: "#64748b" }}
        />
        <Radar
          dataKey="value"
          stroke="#06B6D4"
          fill="#4F46E5"
          fillOpacity={0.35}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
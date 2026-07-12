"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

type Item = {
  label: string;
  value: number;
};

export default function BusinessBarChart({ data }: { data: Item[] }) {
  return (
    <div className="premiumChart">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
          <XAxis type="number" stroke="#94a3b8" />
          <YAxis
            type="category"
            dataKey="label"
            stroke="#94a3b8"
            width={120}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: "14px",
              color: "white",
            }}
          />
          <Bar dataKey="value" radius={[0, 14, 14, 0]}>
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={index % 2 === 0 ? "#06B6D4" : "#7C3AED"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
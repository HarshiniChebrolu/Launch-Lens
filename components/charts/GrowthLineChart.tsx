"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Item = {
  label: string;
  value: number;
};

export default function GrowthLineChart({ data }: { data: Item[] }) {
  return (
    <div className="premiumChart">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,.08)" />
          <XAxis dataKey="label" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: "14px",
              color: "white",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#06B6D4"
            strokeWidth={4}
            dot={{ r: 5, fill: "#7C3AED" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
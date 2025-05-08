"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const COLORS = ["#2563eb", "#16a34a", "#9333ea", "#ea580c", "#0891b2", "#6366f1", "#a855f7"]

export default function ImportSourceDistributionChart({ data }) {
  return (
    <ChartContainer
      config={{
        value: {
          label: "Imports",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="source"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

// Sample data for pipeline value distribution
const data = [
  { name: "Oncology", value: 38 },
  { name: "Immunology", value: 22 },
  { name: "Rare Disease", value: 17 },
  { name: "Neurology", value: 12 },
  { name: "Cardiology", value: 7 },
  { name: "Other", value: 4 },
]

const COLORS = ["#2563eb", "#16a34a", "#9333ea", "#dc2626", "#ca8a04", "#64748b"]

export default function Chart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={true}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Area</span>
                      <span className="font-bold text-muted-foreground">{payload[0].name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Percentage</span>
                      <span className="font-bold" style={{ color: payload[0].color }}>
                        {payload[0].value}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

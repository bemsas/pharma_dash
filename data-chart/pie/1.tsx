"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

// Sample data for ownership structure
const data = [
  { name: "Institutional", value: 64 },
  { name: "Retail", value: 28 },
  { name: "Insider", value: 8 },
]

const COLORS = ["#2563eb", "#16a34a", "#9333ea"]

export default function Chart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
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
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Type</span>
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

"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data for pharmaceutical valuation metrics
const data = [
  { name: "P/E", value: 16.8 },
  { name: "EV/EBITDA", value: 12.4 },
  { name: "P/S", value: 4.2 },
  { name: "P/B", value: 3.8 },
  { name: "Div Yield", value: 3.2 },
]

export default function Chart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Metric</span>
                      <span className="font-bold text-muted-foreground">{payload[0].payload.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                      <span className="font-bold">{payload[0].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

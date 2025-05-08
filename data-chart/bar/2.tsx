"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data for revenue growth by therapeutic area
const data = [
  { name: "Oncology", value: 12.4 },
  { name: "Immunology", value: 9.8 },
  { name: "Rare Disease", value: 15.2 },
  { name: "Neurology", value: 7.5 },
  { name: "Cardiology", value: 4.2 },
  { name: "Infectious", value: 6.8 },
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
        layout="vertical"
      >
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={100} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Area</span>
                      <span className="font-bold text-muted-foreground">{payload[0].payload.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Growth</span>
                      <span className="font-bold">{payload[0].value}%</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

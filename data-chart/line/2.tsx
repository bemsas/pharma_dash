"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data for R&D productivity trends
const data = [
  { year: "2018", oncology: 32, immunology: 28, rare: 45, cardio: 22 },
  { year: "2019", oncology: 37, immunology: 30, rare: 48, cardio: 24 },
  { year: "2020", oncology: 45, immunology: 35, rare: 52, cardio: 28 },
  { year: "2021", oncology: 52, immunology: 39, rare: 58, cardio: 30 },
  { year: "2022", oncology: 58, immunology: 42, rare: 62, cardio: 32 },
  { year: "2023", oncology: 65, immunology: 48, rare: 68, cardio: 35 },
  { year: "2024", oncology: 72, immunology: 53, rare: 75, cardio: 38 },
]

export default function Chart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Year</span>
                      <span className="font-bold text-muted-foreground">{payload[0].payload.year}</span>
                    </div>
                    {payload.map((entry, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">{entry.name}</span>
                        <span className="font-bold" style={{ color: entry.color }}>
                          {entry.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="oncology"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 3, fill: "#2563eb", stroke: "white", strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="immunology"
          stroke="#16a34a"
          strokeWidth={2}
          dot={{ r: 3, fill: "#16a34a", stroke: "white", strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="rare"
          stroke="#9333ea"
          strokeWidth={2}
          dot={{ r: 3, fill: "#9333ea", stroke: "white", strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="cardio"
          stroke="#dc2626"
          strokeWidth={2}
          dot={{ r: 3, fill: "#dc2626", stroke: "white", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

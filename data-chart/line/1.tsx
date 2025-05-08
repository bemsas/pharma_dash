"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data for pharmaceutical stock performance that matches the image
const data = [
  { month: "Jan", value: 60 },
  { month: "Feb", value: 60 },
  { month: "Mar", value: 62 },
  { month: "Apr", value: 65 },
  { month: "May", value: 63 },
  { month: "Jun", value: 67 },
  { month: "Jul", value: 68 },
  { month: "Aug", value: 70 },
  { month: "Sep", value: 68 },
  { month: "Oct", value: 72 },
  { month: "Nov", value: 75 },
  { month: "Dec", value: 73 },
]

export default function Chart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
          domain={[0, 100]}
          ticks={[0, 20, 40, 60, 80, 100]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
                      <span className="font-bold text-muted-foreground">{payload[0].payload.month}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                      <span className="font-bold">${payload[0].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: "#2563eb", stroke: "white", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

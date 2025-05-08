"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ImportTrendChart({ data }) {
  return (
    <ChartContainer
      config={{
        imports: {
          label: "Imports",
          color: "hsl(var(--chart-1))",
        },
        successRate: {
          label: "Success Rate (%)",
          color: "hsl(var(--chart-2))",
        },
        recordsImported: {
          label: "Records Imported",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          />
          <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="imports"
            stroke="var(--color-imports)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "var(--color-imports)", stroke: "white", strokeWidth: 2 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="successRate"
            stroke="var(--color-successRate)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "var(--color-successRate)", stroke: "white", strokeWidth: 2 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="recordsImported"
            stroke="var(--color-recordsImported)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "var(--color-recordsImported)", stroke: "white", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

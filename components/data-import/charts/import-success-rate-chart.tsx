"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ImportSuccessRateChart({ data }) {
  return (
    <ChartContainer
      config={{
        successRate: {
          label: "Success Rate (%)",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="successRate"
            stroke="var(--color-successRate)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "var(--color-successRate)", stroke: "white", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

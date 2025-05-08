"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ImportVolumeChart({ data }) {
  return (
    <ChartContainer
      config={{
        imports: {
          label: "Imports",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="imports" fill="var(--color-imports)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

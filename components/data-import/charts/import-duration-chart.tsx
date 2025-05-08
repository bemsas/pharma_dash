"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ImportDurationChart({ data }) {
  return (
    <ChartContainer
      config={{
        duration: {
          label: "Duration (seconds)",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="type" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="duration" fill="var(--color-duration)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

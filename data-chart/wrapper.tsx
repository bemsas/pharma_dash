"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface ChartWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  content: React.ComponentType<any>
  title?: string
}

export function ChartWrapper({ content: Chart, className, title, ...props }: ChartWrapperProps) {
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <Chart aria-label={title} />
    </div>
  )
}

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Calendar, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const formSchema = z.object({
  type: z.enum(["companies", "financials", "news", "pipeline"], {
    required_error: "Please select a data type",
  }),
  source: z.string().optional(),
  schedule: z.string().min(5, {
    message: "Please enter a valid cron expression",
  }),
})

const cronPresets = [
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Weekly on Sunday", value: "0 0 * * 0" },
  { label: "Monthly (1st day)", value: "0 0 1 * *" },
  { label: "Quarterly", value: "0 0 1 1,4,7,10 *" },
]

export default function ScheduleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [scheduleStatus, setScheduleStatus] = useState<null | {
    success: boolean
    message: string
    scheduleId?: string
    nextRun?: string
    error?: string
  }>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      source: "",
      schedule: "0 0 * * *", // Daily at midnight
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      setScheduleStatus(null)

      // Submit the schedule
      const response = await fetch("/api/data-import/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: values.type,
          source: values.source || "scheduled",
          schedule: values.schedule,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setScheduleStatus({
          success: true,
          message: result.message,
          scheduleId: result.scheduleId,
          nextRun: result.nextRun,
        })
        form.reset()
      } else {
        setScheduleStatus({
          success: false,
          message: "Failed to schedule import",
          error: result.error || "An unknown error occurred",
        })
      }
    } catch (error) {
      setScheduleStatus({
        success: false,
        message: "Failed to schedule import",
        error: "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="companies">Companies</SelectItem>
                      <SelectItem value="financials">Financial Data</SelectItem>
                      <SelectItem value="news">News Articles</SelectItem>
                      <SelectItem value="pipeline">Pipeline Data</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the type of data you want to import</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Source (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bloomberg, Reuters, API" {...field} />
                  </FormControl>
                  <FormDescription>Specify the source of the data</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule (Cron Expression)</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Cron Presets</h4>
                        <div className="grid gap-2">
                          {cronPresets.map((preset) => (
                            <Button
                              key={preset.value}
                              variant="outline"
                              className="justify-start"
                              onClick={() => {
                                form.setValue("schedule", preset.value)
                              }}
                            >
                              {preset.label}
                              <span className="ml-auto text-xs text-muted-foreground">{preset.value}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormDescription>
                  Enter a cron expression for the schedule (e.g., "0 0 * * *" for daily at midnight)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {scheduleStatus && (
            <Alert variant={scheduleStatus.success ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{scheduleStatus.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>
                {scheduleStatus.message}
                {scheduleStatus.nextRun && scheduleStatus.success && (
                  <div className="mt-2 text-sm">Next run: {new Date(scheduleStatus.nextRun).toLocaleString()}</div>
                )}
                {scheduleStatus.error && <div className="mt-2 text-sm">{scheduleStatus.error}</div>}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Scheduling..." : "Schedule Import"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

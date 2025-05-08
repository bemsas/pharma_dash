"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  type: z.enum(["companies", "financials", "news", "pipeline"], {
    required_error: "Please select a data type",
  }),
  source: z.string().optional(),
  data: z.string().min(2, {
    message: "Data must be valid JSON",
  }),
})

export default function ImportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [importStatus, setImportStatus] = useState<null | {
    success: boolean
    message: string
    importId?: string
    error?: string
  }>(null)
  const [importProgress, setImportProgress] = useState<null | {
    status: string
    progress: number
    recordsProcessed: number
    recordsTotal: number
  }>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      source: "",
      data: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      setImportStatus(null)
      setImportProgress(null)

      // Parse the JSON data
      let parsedData
      try {
        parsedData = JSON.parse(values.data)
        if (!Array.isArray(parsedData)) {
          parsedData = [parsedData]
        }
      } catch (error) {
        setImportStatus({
          success: false,
          message: "Invalid JSON data",
          error: "Please provide valid JSON data as an array of objects",
        })
        setIsSubmitting(false)
        return
      }

      // Submit the import
      const response = await fetch("/api/data-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: values.type,
          source: values.source || "manual",
          data: parsedData,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setImportStatus({
          success: true,
          message: result.message,
          importId: result.importId,
        })

        // Poll for import status
        pollImportStatus(result.importId)
      } else {
        setImportStatus({
          success: false,
          message: "Import failed",
          error: result.error || "An unknown error occurred",
        })
        setIsSubmitting(false)
      }
    } catch (error) {
      setImportStatus({
        success: false,
        message: "Import failed",
        error: "An unexpected error occurred",
      })
      setIsSubmitting(false)
    }
  }

  async function pollImportStatus(importId: string) {
    try {
      const response = await fetch(`/api/data-import/status/${importId}`)

      if (response.ok) {
        const result = await response.json()

        setImportProgress({
          status: result.status,
          progress: result.progress,
          recordsProcessed: result.recordsProcessed,
          recordsTotal: result.recordsTotal,
        })

        if (result.status === "completed" || result.status === "failed") {
          setIsSubmitting(false)
          setImportStatus({
            success: result.status === "completed",
            message:
              result.status === "completed"
                ? `Import completed: ${result.recordsProcessed} records processed`
                : "Import failed",
            error: result.error,
          })
        } else {
          // Continue polling
          setTimeout(() => pollImportStatus(importId), 1000)
        }
      } else {
        setIsSubmitting(false)
        setImportStatus({
          success: false,
          message: "Failed to get import status",
          error: "An error occurred while checking import status",
        })
      }
    } catch (error) {
      setIsSubmitting(false)
      setImportStatus({
        success: false,
        message: "Failed to get import status",
        error: "An unexpected error occurred",
      })
    }
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      form.setValue("data", content)
    }
    reader.readAsText(file)
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
                    <Input placeholder="e.g., Bloomberg, Reuters, Manual" {...field} />
                  </FormControl>
                  <FormDescription>Specify the source of the data</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="data"
            render={({ field }) => (
              <FormItem>
                <FormLabel>JSON Data</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='[{"name": "Pfizer", "ticker": "PFE"}, {"name": "Novartis", "ticker": "NVS"}]'
                    className="min-h-[200px] font-mono"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter JSON data as an array of objects</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Input type="file" accept=".json" id="file-upload" className="hidden" onChange={handleFileUpload} />
            <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload JSON File
            </Button>
          </div>

          {importStatus && (
            <Alert variant={importStatus.success ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{importStatus.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>
                {importStatus.message}
                {importStatus.error && <div className="mt-2 text-sm">{importStatus.error}</div>}
              </AlertDescription>
            </Alert>
          )}

          {importProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Status: {importProgress.status}</span>
                <span>
                  {importProgress.recordsProcessed} / {importProgress.recordsTotal} records
                </span>
              </div>
              <Progress value={importProgress.progress} />
            </div>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Importing..." : "Import Data"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

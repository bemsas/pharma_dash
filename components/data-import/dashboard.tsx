"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import Link from "next/link"
import ImportForm from "./import-form"
import ScheduleForm from "./schedule-form"
import ImportHistory from "./import-history"
import ScheduleList from "./schedule-list"

export default function DataImportDashboard() {
  const [activeTab, setActiveTab] = useState("import")

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Data Import Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Import and manage pharmaceutical data. You can perform manual imports or schedule recurring imports.
          </p>
        </div>
        <Link href="/data-import/statistics">
          <Button variant="outline" className="mt-4 md:mt-0">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Statistics
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="import" onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="import">Manual Import</TabsTrigger>
          <TabsTrigger value="schedule">Scheduled Imports</TabsTrigger>
          <TabsTrigger value="history">Import History</TabsTrigger>
        </TabsList>
        <TabsContent value="import" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Data</CardTitle>
                <CardDescription>Manually import data for companies, financials, news, or pipeline.</CardDescription>
              </CardHeader>
              <CardContent>
                <ImportForm />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="schedule" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Import</CardTitle>
                <CardDescription>Set up recurring data imports using cron expressions.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScheduleForm />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Imports</CardTitle>
                <CardDescription>View and manage your scheduled imports.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScheduleList />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Import History</CardTitle>
              <CardDescription>View the history of data imports.</CardDescription>
            </CardHeader>
            <CardContent>
              <ImportHistory />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

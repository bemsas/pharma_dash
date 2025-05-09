"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, FlaskRoundIcon as Flask, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PipelineDataCard } from "@/components/pipeline-data-card"
import { ErrorBoundary } from "@/components/error-boundary"

// Sample pipeline data
const pipelineData = [
  {
    id: 1,
    asset: "PF-07321332",
    indication: "NSCLC (non small cell lung cancer)",
    phase: "Phase 3",
    targetDate: "2025-Q4",
    mechanism: "EGFR Inhibitor",
    priority: "High",
  },
  {
    id: 2,
    asset: "PF-06826647",
    indication: "Breast Cancer",
    phase: "Phase 2",
    targetDate: "2026-Q2",
    mechanism: "TYK2 Inhibitor",
    priority: "Medium",
  },
  {
    id: 3,
    asset: "PF-06939926",
    indication: "Duchenne Muscular Dystrophy",
    phase: "Phase 3",
    targetDate: "2025-Q3",
    mechanism: "Gene Therapy",
    priority: "High",
  },
  {
    id: 4,
    asset: "PF-06882961",
    indication: "Type 2 Diabetes",
    phase: "Phase 2",
    targetDate: "2026-Q1",
    mechanism: "GLP-1 Receptor Agonist",
    priority: "Medium",
  },
  {
    id: 5,
    asset: "PF-07038124",
    indication: "Rheumatoid Arthritis",
    phase: "Phase 1",
    targetDate: "2027-Q2",
    mechanism: "JAK1 Inhibitor",
    priority: "Low",
  },
  {
    id: 6,
    asset: "PF-07321332",
    indication: "COVID-19",
    phase: "Phase 3",
    targetDate: "2025-Q2",
    mechanism: "Protease Inhibitor",
    priority: "High",
  },
]

export function PipelinePage() {
  const searchParams = useSearchParams()
  const companyParam = searchParams.get("company") || "Pfizer"

  const [searchQuery, setSearchQuery] = useState("")
  const [phaseFilter, setPhaseFilter] = useState("all")
  const [indicationFilter, setIndicationFilter] = useState("all")

  // Filter pipeline data based on search query and filters
  const filteredPipeline = pipelineData.filter((item) => {
    const matchesSearch =
      item.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.indication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mechanism.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPhase = phaseFilter === "all" || item.phase.includes(phaseFilter)
    const matchesIndication = indicationFilter === "all" || item.indication === indicationFilter

    return matchesSearch && matchesPhase && matchesIndication
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Flask className="h-6 w-6 text-blue-600" />
            Pipeline Analysis
          </h1>
          <p className="text-muted-foreground">Drug development pipeline for {companyParam}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pipeline..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      {/* Pipeline Updates Card */}
      <ErrorBoundary>
        <PipelineDataCard company={companyParam} />
      </ErrorBoundary>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={phaseFilter} onValueChange={setPhaseFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Phases" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Phases</SelectItem>
            <SelectItem value="Phase 1">Phase 1</SelectItem>
            <SelectItem value="Phase 2">Phase 2</SelectItem>
            <SelectItem value="Phase 3">Phase 3</SelectItem>
            <SelectItem value="Filed">Filed</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={indicationFilter} onValueChange={setIndicationFilter}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="All Indications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Indications</SelectItem>
            <SelectItem value="NSCLC (non small cell lung cancer)">NSCLC (non small cell lung cancer)</SelectItem>
            <SelectItem value="Breast Cancer">Breast Cancer</SelectItem>
            <SelectItem value="Duchenne Muscular Dystrophy">Duchenne Muscular Dystrophy</SelectItem>
            <SelectItem value="Type 2 Diabetes">Type 2 Diabetes</SelectItem>
            <SelectItem value="Rheumatoid Arthritis">Rheumatoid Arthritis</SelectItem>
            <SelectItem value="COVID-19">COVID-19</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pipeline Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger
            value="all"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            All Pipeline
          </TabsTrigger>
          <TabsTrigger
            value="late"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            Late Stage
          </TabsTrigger>
          <TabsTrigger
            value="early"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            Early Stage
          </TabsTrigger>
          <TabsTrigger
            value="portfolio"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            Portfolio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="p-4">
                <h2 className="text-xl font-semibold">Pipeline Assets</h2>
                <p className="text-sm text-muted-foreground">{filteredPipeline.length} assets found</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Indication</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Mechanism</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPipeline.map((item) => (
                    <TableRow key={`${item.asset}-${item.indication}`}>
                      <TableCell className="font-medium">{item.asset}</TableCell>
                      <TableCell>{item.indication}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.phase === "Phase 3"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : item.phase === "Phase 2"
                                ? "bg-blue-50 text-blue-800 hover:bg-blue-50"
                                : item.phase === "Phase 1"
                                  ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                  : ""
                          }
                        >
                          {item.phase}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.targetDate}</TableCell>
                      <TableCell>{item.mechanism}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.priority === "High"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : item.priority === "Medium"
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                : "bg-green-100 text-green-800 hover:bg-green-100"
                          }
                        >
                          {item.priority}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="late">
          <div className="py-10 text-center text-muted-foreground">
            Late Stage pipeline assets (Phase 3 and Filed) will be displayed here
          </div>
        </TabsContent>

        <TabsContent value="early">
          <div className="py-10 text-center text-muted-foreground">
            Early Stage pipeline assets (Phase 1 and Phase 2) will be displayed here
          </div>
        </TabsContent>

        <TabsContent value="portfolio">
          <div className="py-10 text-center text-muted-foreground">
            Marketed products in the portfolio will be displayed here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

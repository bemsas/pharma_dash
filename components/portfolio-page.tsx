"use client"

import { TabsContent } from "@/components/ui/tabs"

import { useState } from "react"
import { BarChart3, Filter, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartWrapper } from "@/data-chart/wrapper"
import PieChart1 from "@/data-chart/pie/1"
import BarChart1 from "@/data-chart/bar/1"

// Sample portfolio data
const portfolioData = [
  {
    id: 1,
    name: "Lipitor",
    category: "Cardiovascular",
    annualRevenue: "$7.4B",
    growthRate: "+3.2%",
    marketShare: "32%",
    patentExpiry: "Expired",
    status: "Mature",
  },
  {
    id: 2,
    name: "Eliquis",
    category: "Anticoagulant",
    annualRevenue: "$5.9B",
    growthRate: "+12.7%",
    marketShare: "28%",
    patentExpiry: "2026",
    status: "Growth",
  },
  {
    id: 3,
    name: "Prevnar",
    category: "Vaccine",
    annualRevenue: "$5.7B",
    growthRate: "+1.8%",
    marketShare: "85%",
    patentExpiry: "2025",
    status: "Mature",
  },
  {
    id: 4,
    name: "Ibrance",
    category: "Oncology",
    annualRevenue: "$5.4B",
    growthRate: "+8.3%",
    marketShare: "45%",
    patentExpiry: "2027",
    status: "Growth",
  },
  {
    id: 5,
    name: "Xeljanz",
    category: "Immunology",
    annualRevenue: "$2.4B",
    growthRate: "+15.2%",
    marketShare: "22%",
    patentExpiry: "2028",
    status: "Growth",
  },
  {
    id: 6,
    name: "Vyndaqel",
    category: "Rare Disease",
    annualRevenue: "$2.0B",
    growthRate: "+42.6%",
    marketShare: "90%",
    patentExpiry: "2031",
    status: "Growth",
  },
]

export function PortfolioPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter portfolio data based on search query and filters
  const filteredPortfolio = portfolioData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Product Portfolio
          </h1>
          <p className="text-muted-foreground">Analysis of current marketed products and revenue contribution</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
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

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
            <SelectItem value="Anticoagulant">Anticoagulant</SelectItem>
            <SelectItem value="Vaccine">Vaccine</SelectItem>
            <SelectItem value="Oncology">Oncology</SelectItem>
            <SelectItem value="Immunology">Immunology</SelectItem>
            <SelectItem value="Rare Disease">Rare Disease</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Growth">Growth</SelectItem>
            <SelectItem value="Mature">Mature</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Portfolio Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger
            value="all"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            All Products
          </TabsTrigger>
          <TabsTrigger
            value="top"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            Top Products
          </TabsTrigger>
          <TabsTrigger
            value="growth"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            Growth Products
          </TabsTrigger>
          <TabsTrigger
            value="patent"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            Patent Risk
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Therapeutic Area</CardTitle>
                <CardDescription>Distribution of annual revenue by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartWrapper content={PieChart1} className="h-full w-full" title="Revenue by Therapeutic Area" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Growth Rate by Product</CardTitle>
                <CardDescription>Year-over-year growth rate for top products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartWrapper content={BarChart1} className="h-full w-full" title="Growth Rate by Product" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Table */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Product Portfolio</CardTitle>
              <CardDescription>
                {filteredPortfolio.length} {filteredPortfolio.length === 1 ? "product" : "products"} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Annual Revenue</TableHead>
                    <TableHead>Growth Rate</TableHead>
                    <TableHead>Market Share</TableHead>
                    <TableHead>Patent Expiry</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPortfolio.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.annualRevenue}</TableCell>
                      <TableCell className="text-green-600">{item.growthRate}</TableCell>
                      <TableCell>{item.marketShare}</TableCell>
                      <TableCell
                        className={
                          item.patentExpiry === "Expired"
                            ? "text-red-600"
                            : Number.parseInt(item.patentExpiry) <= 2025
                              ? "text-amber-600"
                              : ""
                        }
                      >
                        {item.patentExpiry}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.status === "Growth"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top">
          <div className="py-10 text-center text-muted-foreground">
            Top revenue-generating products will be displayed here
          </div>
        </TabsContent>

        <TabsContent value="growth">
          <div className="py-10 text-center text-muted-foreground">
            Products with highest growth rates will be displayed here
          </div>
        </TabsContent>

        <TabsContent value="patent">
          <div className="py-10 text-center text-muted-foreground">
            Products with upcoming patent expirations will be displayed here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

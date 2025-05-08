"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Filter, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for demonstration
const companies = [
  {
    id: 1,
    name: "Pfizer",
    ticker: "PFE",
    sector: "Pharmaceuticals",
    marketCap: "$284B",
    headquarters: "New York, USA",
    employees: "78,500",
    founded: "1849",
    description: "A leading global pharmaceutical company focused on developing medicines and vaccines.",
  },
  {
    id: 2,
    name: "Johnson & Johnson",
    ticker: "JNJ",
    sector: "Healthcare",
    marketCap: "$428B",
    headquarters: "New Jersey, USA",
    employees: "134,500",
    founded: "1886",
    description:
      "A multinational corporation that develops medical devices, pharmaceuticals, and consumer packaged goods.",
  },
  {
    id: 3,
    name: "Merck",
    ticker: "MRK",
    sector: "Pharmaceuticals",
    marketCap: "$217B",
    headquarters: "New Jersey, USA",
    employees: "68,000",
    founded: "1891",
    description: "A global healthcare company focused on prescription medicines, vaccines, and animal health products.",
  },
  {
    id: 4,
    name: "AbbVie",
    ticker: "ABBV",
    sector: "Biopharmaceuticals",
    marketCap: "$192B",
    headquarters: "Illinois, USA",
    employees: "47,000",
    founded: "2013",
    description: "A research-based biopharmaceutical company focused on immunology and oncology treatments.",
  },
  {
    id: 5,
    name: "Bristol Myers Squibb",
    ticker: "BMY",
    sector: "Biopharmaceuticals",
    marketCap: "$156B",
    headquarters: "New York, USA",
    employees: "32,200",
    founded: "1887",
    description: "A global biopharmaceutical company focused on discovering, developing, and delivering medicines.",
  },
  {
    id: 6,
    name: "Novartis",
    ticker: "NVS",
    sector: "Pharmaceuticals",
    marketCap: "$205B",
    headquarters: "Basel, Switzerland",
    employees: "108,000",
    founded: "1996",
    description:
      "A global healthcare company that provides solutions to address the evolving needs of patients worldwide.",
  },
  {
    id: 7,
    name: "Roche",
    ticker: "RHHBY",
    sector: "Pharmaceuticals",
    marketCap: "$312B",
    headquarters: "Basel, Switzerland",
    employees: "94,000",
    founded: "1896",
    description:
      "A global pioneer in pharmaceuticals and diagnostics focused on advancing science to improve people's lives.",
  },
  {
    id: 8,
    name: "GlaxoSmithKline",
    ticker: "GSK",
    sector: "Pharmaceuticals",
    marketCap: "$87B",
    headquarters: "London, UK",
    employees: "94,000",
    founded: "2000",
    description:
      "A research-based pharmaceutical company with a focus on developing innovative medicines and vaccines.",
  },
]

export function CompanySelector() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  // Filter companies based on search query and filters
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSector = sectorFilter === "all" || company.sector.toLowerCase() === sectorFilter.toLowerCase()

    return matchesSearch && matchesSector
  })

  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-white p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">Company Selector</h1>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="biopharmaceuticals">Biopharmaceuticals</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="ml-auto md:ml-0">
              <Filter className="h-4 w-4" />
              <span className="sr-only">More filters</span>
            </Button>
          </div>
          <div className="ml-auto">
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <h2 className="text-lg font-medium mb-4">
          {filteredCompanies.length} {filteredCompanies.length === 1 ? "company" : "companies"} found
        </h2>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-start">
                    <span>{company.name}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                      <Star className="h-4 w-4" />
                      <span className="sr-only">Favorite</span>
                    </Button>
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <Building2 className="h-3 w-3 mr-1" />
                    {company.ticker} • {company.sector}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">{company.description}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 text-sm">
                    <div className="text-muted-foreground">Market Cap:</div>
                    <div className="font-medium">{company.marketCap}</div>
                    <div className="text-muted-foreground">Headquarters:</div>
                    <div className="font-medium">{company.headquarters}</div>
                    <div className="text-muted-foreground">Founded:</div>
                    <div className="font-medium">{company.founded}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/?company=${company.name}`}>View Analysis</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCompanies.map((company) => (
              <Card key={company.id}>
                <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {company.ticker} • {company.sector}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Star className="h-4 w-4" />
                        <span className="sr-only">Favorite</span>
                      </Button>
                    </div>
                    <p className="text-sm mt-2">{company.description}</p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Market Cap: </span>
                      <span className="font-medium">{company.marketCap}</span>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/?company=${company.name}`}>View Analysis</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

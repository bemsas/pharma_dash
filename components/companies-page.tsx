"use client"

import { useState } from "react"
import { Building2, Filter, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for pharmaceutical companies
const companiesData = [
  {
    id: 1,
    name: "Pfizer",
    ticker: "PFE",
    sector: "Pharmaceuticals",
    description: "A leading global pharmaceutical company focused on developing medicines and vaccines.",
    marketCap: "$284B",
    headquarters: "New York, USA",
    founded: "1849",
    isFavorite: false,
  },
  {
    id: 2,
    name: "Johnson & Johnson",
    ticker: "JNJ",
    sector: "Healthcare",
    description:
      "A multinational corporation that develops medical devices, pharmaceuticals, and consumer packaged goods.",
    marketCap: "$428B",
    headquarters: "New Jersey, USA",
    founded: "1886",
    isFavorite: false,
  },
  {
    id: 3,
    name: "Merck",
    ticker: "MRK",
    sector: "Pharmaceuticals",
    description: "A global healthcare company focused on prescription medicines, vaccines, and animal health products.",
    marketCap: "$217B",
    headquarters: "New Jersey, USA",
    founded: "1891",
    isFavorite: false,
  },
  {
    id: 4,
    name: "AbbVie",
    ticker: "ABBV",
    sector: "Biopharmaceuticals",
    description: "A research-based biopharmaceutical company focused on immunology and oncology treatments.",
    marketCap: "$192B",
    headquarters: "Illinois, USA",
    founded: "2013",
    isFavorite: false,
  },
  {
    id: 5,
    name: "Bristol Myers Squibb",
    ticker: "BMY",
    sector: "Biopharmaceuticals",
    description: "A global biopharmaceutical company focused on discovering, developing, and delivering medicines.",
    marketCap: "$156B",
    headquarters: "New York, USA",
    founded: "1887",
    isFavorite: false,
  },
  {
    id: 6,
    name: "Novartis",
    ticker: "NVS",
    sector: "Pharmaceuticals",
    description:
      "A global healthcare company that provides solutions to address the evolving needs of patients worldwide.",
    marketCap: "$205B",
    headquarters: "Basel, Switzerland",
    founded: "1996",
    isFavorite: false,
  },
  {
    id: 7,
    name: "Roche",
    ticker: "RHHBY",
    sector: "Pharmaceuticals",
    description:
      "A global pioneer in pharmaceuticals and diagnostics focused on advancing science to improve people's lives.",
    marketCap: "$312B",
    headquarters: "Basel, Switzerland",
    founded: "1896",
    isFavorite: false,
  },
  {
    id: 8,
    name: "GlaxoSmithKline",
    ticker: "GSK",
    sector: "Pharmaceuticals",
    description:
      "A research-based pharmaceutical company with a focus on developing innovative medicines and vaccines.",
    marketCap: "$87B",
    headquarters: "London, UK",
    founded: "2000",
    isFavorite: false,
  },
]

export function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [companies, setCompanies] = useState(companiesData)

  // Filter companies based on search query and sector filter
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSector = sectorFilter === "all" || company.sector.toLowerCase() === sectorFilter.toLowerCase()

    return matchesSearch && matchesSector
  })

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setCompanies(
      companies.map((company) => (company.id === id ? { ...company, isFavorite: !company.isFavorite } : company)),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Company Selector</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="biopharmaceuticals">Biopharmaceuticals</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">More filters</span>
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-[150px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Companies count */}
      <div>
        <p className="text-sm text-muted-foreground">
          {filteredCompanies.length} {filteredCompanies.length === 1 ? "company" : "companies"} found
        </p>
      </div>

      {/* Companies grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">{company.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Building2 className="h-3 w-3 mr-1" />
                        {company.ticker} • {company.sector}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorite(company.id)}>
                      <Star className={`h-4 w-4 ${company.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                      <span className="sr-only">Favorite</span>
                    </Button>
                  </div>
                  <p className="text-sm mb-4">{company.description}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-4">
                    <div className="text-muted-foreground">Market Cap:</div>
                    <div className="font-medium">{company.marketCap}</div>
                    <div className="text-muted-foreground">Headquarters:</div>
                    <div className="font-medium">{company.headquarters}</div>
                    <div className="text-muted-foreground">Founded:</div>
                    <div className="font-medium">{company.founded}</div>
                  </div>
                  <Button asChild className="w-full">
                    <a href={`/?company=${company.name}`}>View Analysis</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCompanies.map((company) => (
            <Card key={company.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {company.ticker} • {company.sector}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(company.id)}
                      >
                        <Star className={`h-4 w-4 ${company.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
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
                      <a href={`/?company=${company.name}`}>View Analysis</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

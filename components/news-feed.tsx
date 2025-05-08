"use client"

import { useState } from "react"
import { Calendar, Newspaper, Search, ThumbsDown, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for demonstration
const newsArticles = [
  {
    id: 1,
    title: "Pfizer Announces Breakthrough in Cancer Treatment Research",
    source: "MedicalNews Today",
    date: "2025-05-01",
    snippet:
      "Pharmaceutical giant Pfizer has announced promising results from a Phase 3 clinical trial for its new oncology drug targeting rare forms of lung cancer.",
    sentiment: "positive",
    relevance: "high",
    category: "Research",
    company: "Pfizer",
  },
  {
    id: 2,
    title: "Johnson & Johnson Faces New Litigation Over Product Safety",
    source: "Wall Street Journal",
    date: "2025-04-28",
    snippet:
      "Johnson & Johnson is facing a new round of lawsuits related to product safety concerns, potentially impacting the company's financial outlook for the coming year.",
    sentiment: "negative",
    relevance: "high",
    category: "Legal",
    company: "Johnson & Johnson",
  },
  {
    id: 3,
    title: "Merck Expands Manufacturing Capacity in Asia",
    source: "Pharma Manufacturing",
    date: "2025-04-25",
    snippet:
      "Merck has announced a significant investment to expand its manufacturing capabilities in Singapore, aiming to meet growing demand in Asian markets.",
    sentiment: "positive",
    relevance: "medium",
    category: "Business",
    company: "Merck",
  },
  {
    id: 4,
    title: "AbbVie's Patent for Blockbuster Drug Challenged",
    source: "Reuters",
    date: "2025-04-22",
    snippet:
      "Generic drug manufacturers have filed a legal challenge against AbbVie's patent extension for its blockbuster immunology drug, potentially opening the door to earlier generic competition.",
    sentiment: "negative",
    relevance: "high",
    category: "Legal",
    company: "AbbVie",
  },
  {
    id: 5,
    title: "Bristol Myers Squibb Partners with Tech Startup for AI Drug Discovery",
    source: "TechCrunch",
    date: "2025-04-20",
    snippet:
      "Bristol Myers Squibb has announced a strategic partnership with an AI startup to accelerate drug discovery using machine learning algorithms.",
    sentiment: "positive",
    relevance: "medium",
    category: "Innovation",
    company: "Bristol Myers Squibb",
  },
  {
    id: 6,
    title: "Novartis Receives FDA Approval for New Treatment",
    source: "FDA News",
    date: "2025-04-18",
    snippet:
      "Novartis has received FDA approval for its new treatment targeting a rare genetic disorder, expanding the company's portfolio of specialty medications.",
    sentiment: "positive",
    relevance: "high",
    category: "Regulatory",
    company: "Novartis",
  },
  {
    id: 7,
    title: "Roche Reports Strong Q1 Earnings, Raises Guidance",
    source: "Financial Times",
    date: "2025-04-15",
    snippet:
      "Roche has reported better-than-expected first-quarter earnings and raised its full-year guidance, citing strong demand for its diagnostic tests and cancer treatments.",
    sentiment: "positive",
    relevance: "high",
    category: "Financial",
    company: "Roche",
  },
  {
    id: 8,
    title: "GlaxoSmithKline Vaccine Shows Promise Against Emerging Virus",
    source: "Science Daily",
    date: "2025-04-12",
    snippet:
      "GlaxoSmithKline's experimental vaccine has shown promising results in early-stage trials against an emerging viral threat, potentially positioning the company as a leader in this therapeutic area.",
    sentiment: "positive",
    relevance: "medium",
    category: "Research",
    company: "GlaxoSmithKline",
  },
  {
    id: 9,
    title: "AstraZeneca Faces Supply Chain Disruptions",
    source: "Supply Chain Dive",
    date: "2025-04-10",
    snippet:
      "AstraZeneca is experiencing significant supply chain disruptions affecting the distribution of several key products, potentially impacting quarterly sales targets.",
    sentiment: "negative",
    relevance: "medium",
    category: "Operations",
    company: "AstraZeneca",
  },
  {
    id: 10,
    title: "Sanofi Announces Major Restructuring Plan",
    source: "Reuters",
    date: "2025-04-08",
    snippet:
      "Sanofi has announced a comprehensive restructuring plan aimed at streamlining operations and focusing resources on high-growth therapeutic areas.",
    sentiment: "neutral",
    relevance: "high",
    category: "Business",
    company: "Sanofi",
  },
]

export function NewsFeed() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [sentimentFilter, setSentimentFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")

  // Get unique companies for filter
  const companies = [...new Set(newsArticles.map((article) => article.company))].sort()

  // Get unique categories for filter
  const categories = [...new Set(newsArticles.map((article) => article.category))].sort()

  // Filter articles based on search query and filters
  const filteredArticles = newsArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.snippet.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || article.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesCompany = companyFilter === "all" || article.company === companyFilter
    const matchesSentiment = sentimentFilter === "all" || article.sentiment === sentimentFilter

    return matchesSearch && matchesCategory && matchesCompany && matchesSentiment
  })

  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-white p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-blue-600" />
          News Feed
        </h1>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiment</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All News</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
              <TabsTrigger value="legal">Legal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="space-y-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg">{article.title}</h3>
                      <Badge
                        variant={
                          article.sentiment === "positive"
                            ? "success"
                            : article.sentiment === "negative"
                              ? "destructive"
                              : "outline"
                        }
                        className="shrink-0"
                      >
                        {article.sentiment === "positive" && <ThumbsUp className="mr-1 h-3 w-3" />}
                        {article.sentiment === "negative" && <ThumbsDown className="mr-1 h-3 w-3" />}
                        {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="bg-blue-50">
                        {article.company}
                      </Badge>
                      <span>•</span>
                      <span>{article.source}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {article.date}
                      </span>
                      <span>•</span>
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                    <p className="text-sm">{article.snippet}</p>
                    <div className="pt-2">
                      <Button variant="link" className="p-0 h-auto text-blue-600">
                        Read full article
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">No news articles found matching your criteria.</div>
          )}
        </div>
      </div>
    </div>
  )
}

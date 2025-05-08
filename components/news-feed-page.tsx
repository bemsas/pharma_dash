"use client"

import { useState } from "react"
import { Calendar, Newspaper, Search, ThumbsDown, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample news data
const newsArticlesData = [
  {
    id: 1,
    title: "Pfizer Announces Breakthrough in Cancer Treatment Research",
    company: "Pfizer",
    source: "MedicalNews Today",
    date: "2025-05-01",
    category: "Research",
    sentiment: "positive",
    snippet:
      "Pharmaceutical giant Pfizer has announced promising results from a Phase 3 clinical trial for its new oncology drug targeting rare forms of lung cancer.",
  },
  {
    id: 2,
    title: "Johnson & Johnson Faces New Litigation Over Product Safety",
    company: "Johnson & Johnson",
    source: "Wall Street Journal",
    date: "2025-04-28",
    category: "Legal",
    sentiment: "negative",
    snippet:
      "Johnson & Johnson is facing a new round of lawsuits related to product safety concerns, potentially impacting the company's financial outlook for the coming year.",
  },
  {
    id: 3,
    title: "Merck Expands Manufacturing Capacity in Asia",
    company: "Merck",
    source: "Pharma Manufacturing",
    date: "2025-04-25",
    category: "Business",
    sentiment: "positive",
    snippet:
      "Merck has announced a significant investment to expand its manufacturing capabilities in Singapore, aiming to meet growing demand in Asian markets.",
  },
  {
    id: 4,
    title: "AbbVie's Patent for Blockbuster Drug Challenged",
    company: "AbbVie",
    source: "Reuters",
    date: "2025-04-22",
    category: "Legal",
    sentiment: "negative",
    snippet:
      "Generic drug manufacturers have filed a legal challenge against AbbVie's patent extension for its blockbuster immunology drug, potentially opening the door to earlier generic competition.",
  },
  {
    id: 5,
    title: "Bristol Myers Squibb Partners with Tech Startup for AI Drug Discovery",
    company: "Bristol Myers Squibb",
    source: "TechCrunch",
    date: "2025-04-20",
    category: "Innovation",
    sentiment: "positive",
    snippet:
      "Bristol Myers Squibb has announced a strategic partnership with an AI startup to accelerate drug discovery using machine learning algorithms.",
  },
  {
    id: 6,
    title: "Novartis Receives FDA Approval for New Treatment",
    company: "Novartis",
    source: "FDA News",
    date: "2025-04-18",
    category: "Regulatory",
    sentiment: "positive",
    snippet:
      "Novartis has received FDA approval for its new treatment targeting a rare genetic disorder, expanding the company's portfolio of specialty medications.",
  },
  {
    id: 7,
    title: "Roche Reports Strong Q1 Earnings, Raises Guidance",
    company: "Roche",
    source: "Financial Times",
    date: "2025-04-15",
    category: "Financial",
    sentiment: "positive",
    snippet:
      "Roche has reported better-than-expected first-quarter earnings and raised its full-year guidance, citing strong demand for its diagnostic tests and cancer treatments.",
  },
  {
    id: 8,
    title: "GlaxoSmithKline Vaccine Shows Promise Against Emerging Virus",
    company: "GlaxoSmithKline",
    source: "Science Daily",
    date: "2025-04-12",
    category: "Research",
    sentiment: "positive",
    snippet:
      "GlaxoSmithKline's experimental vaccine has shown promising results in early-stage trials against an emerging viral threat, potentially positioning the company as a leader in this therapeutic area.",
  },
  {
    id: 9,
    title: "AstraZeneca Faces Supply Chain Disruptions",
    company: "AstraZeneca",
    source: "Supply Chain Dive",
    date: "2025-04-10",
    category: "Operations",
    sentiment: "negative",
    snippet:
      "AstraZeneca is experiencing significant supply chain disruptions affecting the distribution of several key products, potentially impacting quarterly sales targets.",
  },
  {
    id: 10,
    title: "Sanofi Announces Major Restructuring Plan",
    company: "Sanofi",
    source: "Reuters",
    date: "2025-04-08",
    category: "Business",
    sentiment: "neutral",
    snippet:
      "Sanofi has announced a comprehensive restructuring plan aimed at streamlining operations and focusing resources on high-growth therapeutic areas.",
  },
]

// Get unique companies
const companies = [...new Set(newsArticlesData.map((article) => article.company))].sort()

// Get unique categories
const categories = [...new Set(newsArticlesData.map((article) => article.category))].sort()

export function NewsFeedPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sentimentFilter, setSentimentFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Filter articles based on search query, filters, and active tab
  const filteredArticles = newsArticlesData.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.snippet.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCompany = companyFilter === "all" || article.company === companyFilter
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter
    const matchesSentiment = sentimentFilter === "all" || article.sentiment === sentimentFilter
    const matchesTab = activeTab === "all" || article.category.toLowerCase() === activeTab.toLowerCase()

    return matchesSearch && matchesCompany && matchesCategory && matchesSentiment && matchesTab
  })

  // Get sentiment badge color
  const getSentimentBadgeClass = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500 text-white"
      case "negative":
        return "bg-red-500 text-white"
      case "neutral":
        return "bg-yellow-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  // Get sentiment icon
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="mr-1 h-3 w-3" />
      case "negative":
        return <ThumbsDown className="mr-1 h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-blue-600" />
          News Feed
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Companies" />
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sentiment</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Time" />
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger
            value="all"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            All News
          </TabsTrigger>
          <TabsTrigger
            value="research"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            Research
          </TabsTrigger>
          <TabsTrigger
            value="financial"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            Financial
          </TabsTrigger>
          <TabsTrigger
            value="regulatory"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            Regulatory
          </TabsTrigger>
          <TabsTrigger
            value="legal"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            Legal
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* News Articles */}
      <div className="space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-lg font-semibold">{article.title}</h2>
                    <Badge className={`rounded-full px-3 ${getSentimentBadgeClass(article.sentiment)}`}>
                      {getSentimentIcon(article.sentiment)}
                      {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">{article.company}</span>
                    <span>•</span>
                    <span>{article.source}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <Badge variant="outline" className="bg-gray-50">
                      {article.category}
                    </Badge>
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
  )
}

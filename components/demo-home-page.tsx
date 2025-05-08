"use client"

import Link from "next/link"
import { useState } from "react"
import { AlertCircle, BarChart2, ChevronRight, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Testimonials } from "@/components/testimonials"

// Demo components
import { DemoCompanySelector } from "@/components/demo-company-selector"
import { DemoKeyIssuesCard } from "@/components/demo-key-issues-card"
import { DemoInvestorDataCard } from "@/components/demo-investor-data-card"
import { DemoNewsArticlesList } from "@/components/demo-news-articles-list"

export function DemoHomePage() {
  const [selectedCompany, setSelectedCompany] = useState("Pfizer Inc.")

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">Pharma Dashboard</span>
            <div className="ml-2 rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">Demo Mode</div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50">
        <div className="container py-6">
          {/* Demo Banner */}
          <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Demo Mode</AlertTitle>
            <AlertDescription>
              You are viewing demo data. Create an account to access real-time pharmaceutical industry insights.
            </AlertDescription>
          </Alert>

          {/* Company Selector */}
          <div className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Filter for Company</h2>
            <DemoCompanySelector selectedCompany={selectedCompany} onSelectCompany={setSelectedCompany} />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Key Issues */}
            <DemoKeyIssuesCard companyName={selectedCompany} />

            {/* Investor Data */}
            <DemoInvestorDataCard companyName={selectedCompany} />
          </div>

          {/* News Articles */}
          <div className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>News Articles for Company</CardTitle>
                    <CardDescription>Latest news and updates</CardDescription>
                  </div>
                  <Link href="#" className="flex items-center text-sm text-blue-600 hover:underline">
                    <span className="pointer-events-none">All News</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {/* News Tabs - Non-clickable */}
                <div className="mb-4 flex space-x-1 rounded-md bg-gray-100 p-1">
                  <Button variant="default" className="flex-1 cursor-not-allowed">
                    All News
                  </Button>
                  <Button variant="ghost" className="flex-1 cursor-not-allowed opacity-50">
                    Financial
                  </Button>
                  <Button variant="ghost" className="flex-1 cursor-not-allowed opacity-50">
                    Clinical
                  </Button>
                </div>

                <DemoNewsArticlesList companyName={selectedCompany} />

                <div className="mt-4 flex items-center justify-center rounded-md bg-gray-50 p-3 text-sm text-gray-500">
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Create an account to view more news and enable filtering</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-8 rounded-lg bg-blue-50 p-6 text-center">
            <h2 className="mb-2 text-2xl font-bold text-blue-800">Ready to access full features?</h2>
            <p className="mb-6 text-blue-600">
              Sign up now to get real-time data, advanced filtering, and personalized insights.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg">Create Account</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-12">
            <h2 className="mb-8 text-center text-2xl font-bold">What Our Users Say</h2>
            <Testimonials />
          </div>
        </div>
      </main>

      <footer className="border-t bg-white py-6">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-blue-600" />
              <span className="font-medium">Pharma Dashboard</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Pharma Dashboard. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BarChart2,
  Globe,
  TrendingUp,
  Newspaper,
  FlaskRoundIcon as Flask,
  ExternalLink,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <BarChart2 className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold">Pharma Dashboard</span>
          </div>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Pharmaceutical Industry Intelligence Dashboard
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Comprehensive analytics and insights for pharmaceutical companies, investors, and executives.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/home">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Try Demo <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-lg">
                  <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                  <div className="relative">
                    <img
                      src="/placeholder.svg?key=vychp"
                      alt="Pharma Dashboard Preview"
                      className="rounded-lg shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<TrendingUp className="h-10 w-10 text-blue-600" />}
                title="Financial Analytics"
                description="Track key financial metrics, investment trends, and valuation data for pharmaceutical companies."
              />
              <FeatureCard
                icon={<Newspaper className="h-10 w-10 text-blue-600" />}
                title="News Intelligence"
                description="Stay updated with the latest industry news and sentiment analysis for informed decision making."
              />
              <FeatureCard
                icon={<Flask className="h-10 w-10 text-blue-600" />}
                title="Pipeline Tracking"
                description="Monitor drug development pipelines, clinical trials, and regulatory approvals."
              />
              <FeatureCard
                icon={<BarChart2 className="h-10 w-10 text-blue-600" />}
                title="Competitive Analysis"
                description="Compare companies across key metrics and identify competitive advantages."
              />
              <FeatureCard
                icon={<Globe className="h-10 w-10 text-blue-600" />}
                title="Market Trends"
                description="Visualize market trends, sector performance, and geographic distribution."
              />
              <FeatureCard
                icon={<TrendingUp className="h-10 w-10 text-blue-600" />}
                title="Strategic Insights"
                description="Gain strategic insights on key business issues affecting pharmaceutical companies."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to gain pharmaceutical industry insights?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of analysts, investors, and executives who use our dashboard for data-driven decision
              making.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Create Your Account
                </Button>
              </Link>
              <Link href="/home">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                >
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <BarChart2 className="h-6 w-6 text-blue-600 mr-2" />
              <span className="font-semibold">Pharma Dashboard</span>
            </div>
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} Pharma Dashboard. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

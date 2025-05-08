"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, FileText, Home, Menu, Newspaper, Settings, X } from "lucide-react"
import { AuthProvider } from "@/components/auth/auth-context"
import { UserMenu } from "@/components/auth/user-menu"
import { useEffect, useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // Set initial width
    setWindowWidth(window.innerWidth)

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/companies",
      label: "Companies",
      icon: Building2,
      active: pathname === "/companies",
    },
    {
      href: "/news",
      label: "News Feed",
      icon: Newspaper,
      active: pathname === "/news",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="text-xl">PharmaDash</span>
              </Link>
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      route.active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <route.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        route.active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1 w-full">
          {/* Top navigation */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  {/* Mobile menu button */}
                  <div className="flex items-center md:hidden">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                      <span className="sr-only">Open main menu</span>
                      {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  {/* User dropdown */}
                  <div className="ml-4 flex items-center md:ml-6">
                    <UserMenu />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      route.active
                        ? "border-blue-500 text-blue-700 bg-blue-50"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <route.icon className={`mr-3 h-5 w-5 ${route.active ? "text-blue-500" : "text-gray-400"}`} />
                      {route.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                {/* Navigation Tabs - only show on main dashboard pages */}
                {(pathname === "/dashboard" ||
                  pathname === "/financials" ||
                  pathname === "/pipeline" ||
                  pathname === "/portfolio") && (
                  <div className="mb-6 border-b border-gray-200">
                    <div className="flex space-x-8 overflow-x-auto">
                      <Link
                        href="/dashboard"
                        className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                          pathname === "/dashboard"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Overview
                      </Link>
                      <Link
                        href="/financials"
                        className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                          pathname === "/financials"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Financials
                      </Link>
                      <Link
                        href="/pipeline"
                        className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                          pathname === "/pipeline"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Pipeline
                      </Link>
                      <Link
                        href="/portfolio"
                        className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                          pathname === "/portfolio"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Portfolio
                      </Link>
                    </div>
                  </div>
                )}
                <div className="w-full max-w-full">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}

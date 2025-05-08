"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Key, Moon, Settings, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SettingsPage() {
  const [theme, setTheme] = useState("light")

  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-white p-4 md:p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </header>

      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" defaultValue="Acme Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue="analyst">
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="executive">Executive</SelectItem>
                        <SelectItem value="analyst">Analyst</SelectItem>
                        <SelectItem value="investor">Investor</SelectItem>
                        <SelectItem value="consultant">Consultant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline">Cancel</Button>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="news-alerts">News Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about important news for tracked companies
                      </p>
                    </div>
                    <Switch id="news-alerts" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="financial-updates">Financial Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about earnings reports and financial events
                      </p>
                    </div>
                    <Switch id="financial-updates" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="regulatory-alerts">Regulatory Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about FDA decisions and regulatory changes
                      </p>
                    </div>
                    <Switch id="regulatory-alerts" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="market-insights">Market Insights</Label>
                      <p className="text-sm text-muted-foreground">
                        Get weekly summaries of market trends and analysis
                      </p>
                    </div>
                    <Switch id="market-insights" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button className="w-full">Save Notification Preferences</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Preferences</CardTitle>
                <CardDescription>Choose how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-frequency">Email Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="email-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button className="w-full">Save Delivery Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <RadioGroup defaultValue={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                      <Label
                        htmlFor="theme-light"
                        className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
                          theme === "light" ? "border-blue-600" : "border-muted"
                        }`}
                      >
                        <Sun className="h-6 w-6 mb-2" />
                        Light
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                      <Label
                        htmlFor="theme-dark"
                        className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
                          theme === "dark" ? "border-blue-600" : "border-muted"
                        }`}
                      >
                        <Moon className="h-6 w-6 mb-2" />
                        Dark
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                      <Label
                        htmlFor="theme-system"
                        className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
                          theme === "system" ? "border-blue-600" : "border-muted"
                        }`}
                      >
                        <Settings className="h-6 w-6 mb-2" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Dashboard Layout</Label>
                  <Select defaultValue="grid">
                    <SelectTrigger>
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Use a more compact user interface</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button className="w-full">Save Appearance Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage API keys for external data sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="news-api">News API Key</Label>
                    <div className="flex gap-2">
                      <Input id="news-api" type="password" defaultValue="sk_news_api_key_123456789" />
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Used for fetching news articles from external sources
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="financial-api">Financial Data API Key</Label>
                    <div className="flex gap-2">
                      <Input id="financial-api" type="password" defaultValue="sk_financial_api_key_123456789" />
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Used for fetching financial data and market information
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="ai-api">AI Analysis API Key</Label>
                    <div className="flex gap-2">
                      <Input id="ai-api" type="password" defaultValue="sk_ai_api_key_123456789" />
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Used for AI-powered analysis and insights generation
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline">Regenerate Keys</Button>
                <Button>Save API Keys</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Eye icon component for the API keys section
function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [subscribeToNews, setSubscribeToNews] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const { register, isLoading, error, requiresVerification } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setFormError("Passwords do not match")
      return
    }

    // Validate password length
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters")
      return
    }

    // Validate required fields
    if (!email || !name) {
      setFormError("Email and Full Name are required")
      return
    }

    const success = await register({
      username: email, // Use email as username
      email,
      password,
      name,
      subscribeToNews,
    })

    if (success) {
      // If registration is successful but requires verification,
      // the auth context will redirect to the verification page
      if (!requiresVerification) {
        router.push("/")
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Register to access the pharmaceutical dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || formError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError || error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">Must be at least 8 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="subscribeToNews"
              checked={subscribeToNews}
              onCheckedChange={(checked) => setSubscribeToNews(checked === true)}
            />
            <Label htmlFor="subscribeToNews" className="text-sm font-normal cursor-pointer">
              Subscribe to our News Summary
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

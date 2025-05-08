"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { CallbackHandler } from "@/components/auth/callback-handler"
import { Checkbox } from "@/components/ui/checkbox"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [callbackUrl, setCallbackUrl] = useState("/")
  const { login, isLoading, error, requiresVerification } = useAuth()
  const router = useRouter()

  const handleCallback = useCallback((url: string) => {
    setCallbackUrl(url)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const success = await login({ email, password, rememberMe })

    if (success && !requiresVerification) {
      router.push(callbackUrl)
    }
    // If login requires verification, the auth context will redirect to verification page
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CallbackHandler onCallback={handleCallback} />
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-sm text-right">
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800">
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-800">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { loginUser, logoutUser, registerUser, resendVerificationEmailAction } from "@/app/actions/auth-actions"
import type { RegisterData, UserCredentials } from "@/lib/auth/types"

// Define the shape of our user object
interface AuthUser {
  id: string
  username: string
  email: string
  name?: string
  role: "user" | "admin" | "analyst"
  isVerified: boolean
}

// Define the shape of our context
interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
  requiresVerification: boolean
  login: (credentials: UserCredentials & { rememberMe?: boolean }) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => Promise<void>
  resendVerificationEmail: () => Promise<boolean>
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requiresVerification, setRequiresVerification] = useState(false)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true)
        console.log("Loading user data from API")

        // Use fetch to call the API route instead of directly calling the server action
        const response = await fetch("/api/auth/user")

        if (!response.ok) {
          // If the response is not OK, don't set an error - just set user to null
          console.error("Failed to fetch user data:", response.status)
          setUser(null)
          return
        }

        const data = await response.json()
        console.log("User data response:", data)

        if (data.user) {
          console.log("User found, setting user state")
          setUser(data.user)

          // If user exists but is not verified, set requiresVerification
          if (!data.user.isVerified) {
            console.log("User not verified, setting requiresVerification")
            setRequiresVerification(true)
          }
        } else {
          console.log("No user found in response")
          setUser(null)
        }
      } catch (err) {
        console.error("Error loading user:", err)
        // Don't set an error message for the initial load
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Login function
  const login = async (credentials: UserCredentials & { rememberMe?: boolean }): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      setRequiresVerification(false)
      console.log("Attempting login")

      const { rememberMe, ...loginCredentials } = credentials
      const result = await loginUser(loginCredentials, rememberMe)
      console.log("Login result:", result)

      if (result.success && result.user) {
        if (result.requiresVerification) {
          console.log("User requires verification, redirecting")
          setRequiresVerification(true)
          setUser({
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            isVerified: result.user.isVerified,
          })
          router.push("/verify-email")
          return false
        }

        console.log("Login successful, setting user and redirecting")
        setUser({
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          isVerified: result.user.isVerified,
        })

        // Redirect to dashboard after successful login
        router.push("/dashboard")
        return true
      } else {
        console.log("Login failed:", result.message)
        setError(result.message)
        return false
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      setRequiresVerification(false)
      console.log("Attempting registration")

      const result = await registerUser(data)
      console.log("Registration result:", result)

      if (result.success && result.user) {
        if (result.requiresVerification) {
          console.log("User requires verification, redirecting")
          setRequiresVerification(true)
          setUser({
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            isVerified: result.user.isVerified,
          })
          router.push("/verify-email")
          return true
        }

        console.log("Registration successful, setting user and redirecting")
        setUser({
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          isVerified: result.user.isVerified,
        })

        // Redirect to dashboard after successful registration
        router.push("/dashboard")
        return true
      } else {
        console.log("Registration failed:", result.message)
        setError(result.message)
        return false
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("An unexpected error occurred")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      console.log("Logging out")
      await logoutUser()
      setUser(null)
      setRequiresVerification(false)
      router.push("/login")
    } catch (err) {
      console.error("Logout error:", err)
      setError("Failed to log out")
    } finally {
      setIsLoading(false)
    }
  }

  // Resend verification email
  const resendVerificationEmail = async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("Resending verification email")

      const result = await resendVerificationEmailAction()
      console.log("Resend verification result:", result)

      if (result.success) {
        return true
      } else {
        setError(result.message)
        return false
      }
    } catch (err) {
      console.error("Error resending verification email:", err)
      setError("Failed to resend verification email")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Create the context value
  const contextValue: AuthContextType = {
    user,
    isLoading,
    error,
    requiresVerification,
    login,
    register,
    logout,
    resendVerificationEmail,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
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
  const [isLoading, setIsLoading] = useState(false) // Changed to false to avoid loading state when auth is disabled
  const [error, setError] = useState<string | null>(null)
  const [requiresVerification, setRequiresVerification] = useState(false)
  const router = useRouter()

  // Check if user is logged in on mount - DISABLED FOR NOW
  // We're skipping the automatic user loading to bypass authentication
  // The code is kept for future use
  /*
  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true)
        const userData = await getCurrentUser()
        setUser(userData)

        // If user exists but is not verified, set requiresVerification
        if (userData && !userData.isVerified) {
          setRequiresVerification(true)
        }
      } catch (err) {
        console.error("Error loading user:", err)
        setError("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])
  */

  // Login function - kept for future use
  const login = async (credentials: UserCredentials & { rememberMe?: boolean }): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      setRequiresVerification(false)

      const { rememberMe, ...loginCredentials } = credentials
      const result = await loginUser(loginCredentials, rememberMe)

      if (result.success && result.user) {
        if (result.requiresVerification) {
          setRequiresVerification(true)
          router.push("/verify-email")
          return false
        }

        setUser({
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          isVerified: result.user.isVerified,
        })

        // Redirect to dashboard after successful login
        router.push("/")
        return true
      } else {
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

  // Register function - kept for future use
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      setRequiresVerification(false)

      const result = await registerUser(data)

      if (result.success && result.user) {
        if (result.requiresVerification) {
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

        setUser({
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          isVerified: result.user.isVerified,
        })

        // Redirect to dashboard after successful registration
        router.push("/")
        return true
      } else {
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

  // Logout function - kept for future use
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
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

  // Resend verification email - kept for future use
  const resendVerificationEmail = async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await resendVerificationEmailAction()

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

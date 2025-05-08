export interface User {
  id: string
  username: string
  email: string
  name: string
  role: "user" | "admin" | "analyst"
  createdAt: number
  isVerified: boolean
  preferences?: {
    subscribeToNews?: boolean
    theme?: string
    [key: string]: any
  }
}

export interface UserCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  name: string
  subscribeToNews?: boolean
}

export interface AuthSession {
  userId: string
  username: string
  email: string
  name?: string
  role: "user" | "admin" | "analyst"
  isAuthenticated: boolean
  isVerified: boolean
  expiresAt: number
}

export interface AuthResult {
  success: boolean
  message: string
  user?: User
  requiresVerification?: boolean
}

export interface VerificationToken {
  userId: string
  token: string
  expiresAt: number
}

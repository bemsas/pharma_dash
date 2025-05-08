// User credentials for login
export interface UserCredentials {
  email: string
  password: string
}

// Registration data
export interface RegisterData {
  username: string
  email: string
  password: string
  name: string
  subscribeToNews?: boolean
}

// User model
export interface User {
  id: string
  username: string
  email: string
  passwordHash: string
  name: string
  role: "user" | "admin" | "analyst"
  createdAt: string
  updatedAt: string
  isVerified: boolean
  subscribeToNews?: boolean
}

// Authentication result
export interface AuthResult {
  success: boolean
  message: string
  user?: User
  requiresVerification?: boolean
}

// Authentication session
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

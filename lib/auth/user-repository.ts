import { v4 as uuidv4 } from "uuid"
import { redis } from "@/lib/redis"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { sendVerificationEmail } from "@/lib/auth/email-service"
import type { User, RegisterData, UserCredentials, AuthResult } from "@/lib/auth/types"

// User repository for Redis
export const userRepository = {
  // Create a new user
  async createUser(data: RegisterData): Promise<AuthResult> {
    try {
      // Check if email already exists
      const existingUserByEmail = await redis.get(`user:email:${data.email.toLowerCase()}`)
      if (existingUserByEmail) {
        return { success: false, message: "Email already in use" }
      }

      // Check if username already exists
      const existingUserByUsername = await redis.get(`user:username:${data.username.toLowerCase()}`)
      if (existingUserByUsername) {
        return { success: false, message: "Username already in use" }
      }

      // Create user object
      const userId = uuidv4()
      const hashedPassword = hashPassword(data.password)
      const now = Date.now()

      const user: User = {
        id: userId,
        username: data.username,
        email: data.email,
        name: data.name,
        role: "user", // Default role
        createdAt: now,
        isVerified: false, // User starts as unverified
        preferences: {
          subscribeToNews: data.subscribeToNews || false,
        },
      }

      // Store user data in Redis
      await redis.set(`user:${userId}`, user)

      // Store user credentials separately for security
      await redis.set(`user:credentials:${userId}`, { hashedPassword })

      // Create indexes for lookup
      await redis.set(`user:email:${data.email.toLowerCase()}`, userId)
      await redis.set(`user:username:${data.username.toLowerCase()}`, userId)

      // Send verification email
      await sendVerificationEmail(userId, data.email)

      return {
        success: true,
        message: "User registered successfully. Please check your email to verify your account.",
        user,
        requiresVerification: true,
      }
    } catch (error) {
      console.error("Error creating user:", error)
      return { success: false, message: "Failed to register user" }
    }
  },

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await redis.get<User>(`user:${userId}`)
      return user
    } catch (error) {
      console.error("Error getting user by ID:", error)
      return null
    }
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const userId = await redis.get<string>(`user:email:${email.toLowerCase()}`)
      if (!userId) return null

      return await this.getUserById(userId)
    } catch (error) {
      console.error("Error getting user by email:", error)
      return null
    }
  },

  // Get user by username
  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const userId = await redis.get<string>(`user:username:${username.toLowerCase()}`)
      if (!userId) return null

      return await this.getUserById(userId)
    } catch (error) {
      console.error("Error getting user by username:", error)
      return null
    }
  },

  // Verify user credentials
  async verifyCredentials(credentials: UserCredentials): Promise<AuthResult> {
    try {
      // Get user by email
      const userId = await redis.get<string>(`user:email:${credentials.email.toLowerCase()}`)
      if (!userId) {
        return { success: false, message: "Invalid email or password" }
      }

      // Get user credentials
      const userCredentials = await redis.get<{ hashedPassword: string }>(`user:credentials:${userId}`)
      if (!userCredentials) {
        return { success: false, message: "Invalid email or password" }
      }

      // Verify password
      const isPasswordValid = verifyPassword(credentials.password, userCredentials.hashedPassword)
      if (!isPasswordValid) {
        return { success: false, message: "Invalid email or password" }
      }

      // Get user data
      const user = await this.getUserById(userId)
      if (!user) {
        return { success: false, message: "User not found" }
      }

      // Check if user is verified
      if (!user.isVerified) {
        return {
          success: true,
          message: "Please verify your email before logging in",
          user,
          requiresVerification: true,
        }
      }

      return { success: true, message: "Login successful", user }
    } catch (error) {
      console.error("Error verifying credentials:", error)
      return { success: false, message: "Authentication failed" }
    }
  },

  // Update user profile
  async updateUser(userId: string, updates: Partial<User>): Promise<AuthResult> {
    try {
      const user = await this.getUserById(userId)
      if (!user) {
        return { success: false, message: "User not found" }
      }

      // Check if email is being updated and is unique
      if (updates.email && updates.email !== user.email) {
        const existingUserByEmail = await redis.get(`user:email:${updates.email.toLowerCase()}`)
        if (existingUserByEmail && existingUserByEmail !== userId) {
          return { success: false, message: "Email already in use" }
        }

        // Update email index
        await redis.del(`user:email:${user.email.toLowerCase()}`)
        await redis.set(`user:email:${updates.email.toLowerCase()}`, userId)

        // If email is changed, set isVerified to false and send new verification email
        updates.isVerified = false
        await sendVerificationEmail(userId, updates.email)
      }

      // Check if username is being updated and is unique
      if (updates.username && updates.username !== user.username) {
        const existingUserByUsername = await redis.get(`user:username:${updates.username.toLowerCase()}`)
        if (existingUserByUsername && existingUserByUsername !== userId) {
          return { success: false, message: "Username already in use" }
        }

        // Update username index
        await redis.del(`user:username:${user.username.toLowerCase()}`)
        await redis.set(`user:username:${updates.username.toLowerCase()}`, userId)
      }

      // Update user data
      const updatedUser = { ...user, ...updates }
      await redis.set(`user:${userId}`, updatedUser)

      return {
        success: true,
        message:
          updates.email && updates.email !== user.email
            ? "User updated successfully. Please verify your new email address."
            : "User updated successfully",
        user: updatedUser,
        requiresVerification: updates.email && updates.email !== user.email ? true : false,
      }
    } catch (error) {
      console.error("Error updating user:", error)
      return { success: false, message: "Failed to update user" }
    }
  },

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResult> {
    try {
      // Get user credentials
      const userCredentials = await redis.get<{ hashedPassword: string }>(`user:credentials:${userId}`)
      if (!userCredentials) {
        return { success: false, message: "User not found" }
      }

      // Verify current password
      const isPasswordValid = verifyPassword(currentPassword, userCredentials.hashedPassword)
      if (!isPasswordValid) {
        return { success: false, message: "Current password is incorrect" }
      }

      // Hash new password
      const hashedPassword = hashPassword(newPassword)

      // Update credentials
      await redis.set(`user:credentials:${userId}`, { hashedPassword })

      return { success: true, message: "Password changed successfully" }
    } catch (error) {
      console.error("Error changing password:", error)
      return { success: false, message: "Failed to change password" }
    }
  },

  // Verify user's email
  async verifyEmail(userId: string): Promise<AuthResult> {
    try {
      const user = await this.getUserById(userId)
      if (!user) {
        return { success: false, message: "User not found" }
      }

      // Update user's verification status
      const updatedUser = { ...user, isVerified: true }
      await redis.set(`user:${userId}`, updatedUser)

      return { success: true, message: "Email verified successfully", user: updatedUser }
    } catch (error) {
      console.error("Error verifying email:", error)
      return { success: false, message: "Failed to verify email" }
    }
  },
}

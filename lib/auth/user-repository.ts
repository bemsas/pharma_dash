import { v4 as uuidv4 } from "uuid"
import { redis } from "@/lib/redis"
import { verifyPassword, hashPassword } from "./password"
import type { User, RegisterData, UserCredentials } from "./types"

// User repository functions
export const userRepository = {
  // Create a new user
  async createUser(
    data: RegisterData & { passwordHash: string; isVerified?: boolean; verificationToken?: string },
  ): Promise<User> {
    const userId = uuidv4()

    const user: User = {
      id: userId,
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name,
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: data.isVerified ?? true,
      subscribeToNews: data.subscribeToNews ?? false,
    }

    // Store user in Redis
    await redis.set(`user:${userId}`, user)
    await redis.set(`user:email:${data.email}`, userId)
    await redis.set(`user:username:${data.username}`, userId)

    // If verification token is provided, store it
    if (data.verificationToken) {
      await redis.set(`verification:${data.verificationToken}`, userId, { ex: 60 * 60 * 24 }) // 24 hours
    }

    return user
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

  // Find user by email
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const userId = await redis.get<string>(`user:email:${email}`)

      if (!userId) {
        return null
      }

      return this.getUserById(userId)
    } catch (error) {
      console.error("Error finding user by email:", error)
      return null
    }
  },

  // Find user by username
  async findUserByUsername(username: string): Promise<User | null> {
    try {
      const userId = await redis.get<string>(`user:username:${username}`)

      if (!userId) {
        return null
      }

      return this.getUserById(userId)
    } catch (error) {
      console.error("Error finding user by username:", error)
      return null
    }
  },

  // Verify user credentials
  async verifyCredentials(credentials: UserCredentials): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const user = await this.findUserByEmail(credentials.email)

      if (!user) {
        return { success: false, message: "Invalid email or password" }
      }

      const passwordMatch = await verifyPassword(credentials.password, user.passwordHash)

      if (!passwordMatch) {
        return { success: false, message: "Invalid email or password" }
      }

      return { success: true, user }
    } catch (error) {
      console.error("Error verifying credentials:", error)
      return { success: false, message: "An unexpected error occurred" }
    }
  },

  // Update user
  async updateUser(
    userId: string,
    updates: { name?: string },
  ): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const user = await this.getUserById(userId)

      if (!user) {
        return { success: false, message: "User not found" }
      }

      const updatedUser: User = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      await redis.set(`user:${userId}`, updatedUser)

      return { success: true, user: updatedUser }
    } catch (error) {
      console.error("Error updating user:", error)
      return { success: false, message: "An unexpected error occurred" }
    }
  },

  // Change password
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const user = await this.getUserById(userId)

      if (!user) {
        return { success: false, message: "User not found" }
      }

      const passwordMatch = await verifyPassword(currentPassword, user.passwordHash)

      if (!passwordMatch) {
        return { success: false, message: "Current password is incorrect" }
      }

      const newPasswordHash = await hashPassword(newPassword)

      const updatedUser: User = {
        ...user,
        passwordHash: newPasswordHash,
        updatedAt: new Date().toISOString(),
      }

      await redis.set(`user:${userId}`, updatedUser)

      return { success: true }
    } catch (error) {
      console.error("Error changing password:", error)
      return { success: false, message: "An unexpected error occurred" }
    }
  },

  // Verify email
  async verifyEmail(userId: string): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const user = await this.getUserById(userId)

      if (!user) {
        return { success: false, message: "User not found" }
      }

      const updatedUser: User = {
        ...user,
        isVerified: true,
        updatedAt: new Date().toISOString(),
      }

      await redis.set(`user:${userId}`, updatedUser)

      return { success: true, user: updatedUser }
    } catch (error) {
      console.error("Error verifying email:", error)
      return { success: false, message: "An unexpected error occurred" }
    }
  },

  // Update user verification status by token
  async updateUserVerification(token: string, userId?: string): Promise<User | null> {
    try {
      // If userId is provided, use it directly
      if (userId) {
        const user = await this.getUserById(userId)

        if (!user) {
          return null
        }

        const updatedUser: User = {
          ...user,
          isVerified: true,
          updatedAt: new Date().toISOString(),
        }

        await redis.set(`user:${userId}`, updatedUser)

        return updatedUser
      }

      // Otherwise, look up the user ID by token
      const tokenUserId = await redis.get<string>(`verification:${token}`)

      if (!tokenUserId) {
        return null
      }

      const user = await this.getUserById(tokenUserId)

      if (!user) {
        return null
      }

      const updatedUser: User = {
        ...user,
        isVerified: true,
        updatedAt: new Date().toISOString(),
      }

      await redis.set(`user:${tokenUserId}`, updatedUser)

      // Delete the token
      await redis.del(`verification:${token}`)

      return updatedUser
    } catch (error) {
      console.error("Error updating user verification:", error)
      return null
    }
  },
}

// Export individual functions for convenience
export const {
  createUser,
  getUserById,
  findUserByEmail,
  findUserByUsername,
  verifyCredentials,
  updateUser,
  changePassword,
  verifyEmail,
  updateUserVerification,
} = userRepository

import { v4 as uuidv4 } from "uuid"
import { redis } from "@/lib/redis"
import { verifyPassword, hashPassword } from "./password"
import type { User, RegisterData, UserCredentials } from "./types"

// Create a new user
export async function createUser(
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
    isVerified: data.isVerified ?? false,
    subscribeToNews: data.subscribeToNews ?? false,
  }

  // Store user in Redis
  await redis.set(`user:${userId}`, user)
  await redis.set(`user:email:${data.email.toLowerCase()}`, userId)
  await redis.set(`user:username:${data.username.toLowerCase()}`, userId)

  // If verification token is provided, store it
  if (data.verificationToken) {
    await redis.set(`verification:${data.verificationToken}`, userId, { ex: 60 * 60 * 24 }) // 24 hours
  }

  return user
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    if (!userId) {
      console.error("getUserById called with empty userId")
      return null
    }

    console.log(`Getting user by ID: ${userId}`)
    const user = await redis.get<User>(`user:${userId}`)
    return user
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    if (!email) {
      console.error("findUserByEmail called with empty email")
      return null
    }

    console.log(`Finding user by email: ${email}`)
    const userId = await redis.get<string>(`user:email:${email.toLowerCase()}`)

    if (!userId) {
      console.log(`No user found with email: ${email}`)
      return null
    }

    return getUserById(userId)
  } catch (error) {
    console.error("Error finding user by email:", error)
    return null
  }
}

// Find user by username
export async function findUserByUsername(username: string): Promise<User | null> {
  try {
    if (!username) {
      console.error("findUserByUsername called with empty username")
      return null
    }

    console.log(`Finding user by username: ${username}`)
    const userId = await redis.get<string>(`user:username:${username.toLowerCase()}`)

    if (!userId) {
      console.log(`No user found with username: ${username}`)
      return null
    }

    return getUserById(userId)
  } catch (error) {
    console.error("Error finding user by username:", error)
    return null
  }
}

// Verify user credentials
export async function verifyCredentials(
  credentials: UserCredentials,
): Promise<{ success: boolean; message?: string; user?: User }> {
  try {
    const user = await findUserByEmail(credentials.email)

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
}

// Update user
export async function updateUser(
  userId: string,
  updates: { name?: string },
): Promise<{ success: boolean; message?: string; user?: User }> {
  try {
    const user = await getUserById(userId)

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
}

// Change password
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const user = await getUserById(userId)

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
}

// Verify email
export async function verifyEmail(userId: string): Promise<{ success: boolean; message?: string; user?: User }> {
  try {
    const user = await getUserById(userId)

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
}

// Update user verification status by token
export async function updateUserVerification(token: string, userId?: string): Promise<User | null> {
  try {
    console.log(`Updating user verification with token: ${token}, userId: ${userId || "not provided"}`)

    // If userId is provided, use it directly
    if (userId) {
      console.log(`Using provided userId: ${userId}`)
      const user = await getUserById(userId)

      if (!user) {
        console.log(`No user found with ID: ${userId}`)
        return null
      }

      const updatedUser: User = {
        ...user,
        isVerified: true,
        updatedAt: new Date().toISOString(),
      }

      await redis.set(`user:${userId}`, updatedUser)
      console.log(`User ${userId} marked as verified`)
      return updatedUser
    }

    // Otherwise, look up the user ID by token
    console.log(`Looking up user by token: ${token}`)
    const tokenUserId = await redis.get<string>(`verification:${token}`)

    if (!tokenUserId) {
      console.log(`No user ID found for token: ${token}`)
      return null
    }

    console.log(`Found user ID for token: ${tokenUserId}`)
    const user = await getUserById(tokenUserId)

    if (!user) {
      console.log(`No user found with ID from token: ${tokenUserId}`)
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
    console.log(`User ${tokenUserId} marked as verified and token deleted`)

    return updatedUser
  } catch (error) {
    console.error("Error updating user verification:", error)
    return null
  }
}

// Export individual functions for convenience
updateUser.changePassword = changePassword

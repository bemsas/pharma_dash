import { redis } from "@/lib/redis"
import { v4 as uuidv4 } from "uuid"
import { hashPassword, verifyPassword } from "./password"
import type { User, UserCredentials, RegisterData } from "./types"

// User repository prefix
const USER_PREFIX = "user:"
const EMAIL_INDEX_PREFIX = "email_index:"
const USERNAME_INDEX_PREFIX = "username_index:"

// Create a new user
export async function createUser(userData: RegisterData): Promise<User> {
  try {
    console.log(`Creating user with email: ${userData.email}`)

    // Generate user ID
    const userId = uuidv4()

    // Hash password
    const passwordHash = await hashPassword(userData.password)

    // Create user object
    const user: User = {
      id: userId,
      email: userData.email.toLowerCase(),
      username: userData.username.toLowerCase(),
      name: userData.name,
      passwordHash,
      role: "user", // Default role
      isVerified: false, // Default verification status
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store user in Redis
    await redis.set(`${USER_PREFIX}${userId}`, user)

    // Create email and username indexes
    await redis.set(`${EMAIL_INDEX_PREFIX}${user.email}`, userId)
    await redis.set(`${USERNAME_INDEX_PREFIX}${user.username}`, userId)

    console.log(`User created with ID: ${userId}`)
    return user
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    if (!userId) {
      console.error("getUserById called with empty userId")
      return null
    }

    console.log(`Getting user by ID: ${userId}`)
    const user = await redis.get<User>(`${USER_PREFIX}${userId}`)

    if (!user) {
      console.log(`User not found with ID: ${userId}`)
      return null
    }

    console.log(`User found with ID: ${userId}`)
    return user
  } catch (error) {
    console.error(`Error getting user by ID ${userId}:`, error)
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

    const normalizedEmail = email.toLowerCase()
    console.log(`Finding user by email: ${normalizedEmail}`)

    // Get user ID from email index
    const userId = await redis.get<string>(`${EMAIL_INDEX_PREFIX}${normalizedEmail}`)

    if (!userId) {
      console.log(`User not found with email: ${normalizedEmail}`)
      return null
    }

    // Get user by ID
    return getUserById(userId)
  } catch (error) {
    console.error(`Error finding user by email ${email}:`, error)
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

    const normalizedUsername = username.toLowerCase()
    console.log(`Finding user by username: ${normalizedUsername}`)

    // Get user ID from username index
    const userId = await redis.get<string>(`${USERNAME_INDEX_PREFIX}${normalizedUsername}`)

    if (!userId) {
      console.log(`User not found with username: ${normalizedUsername}`)
      return null
    }

    // Get user by ID
    return getUserById(userId)
  } catch (error) {
    console.error(`Error finding user by username ${username}:`, error)
    return null
  }
}

// Authenticate user
export async function authenticateUser(credentials: UserCredentials): Promise<User | null> {
  try {
    console.log(`Authenticating user: ${credentials.emailOrUsername}`)

    // Find user by email or username
    const user =
      (await findUserByEmail(credentials.emailOrUsername)) || (await findUserByUsername(credentials.emailOrUsername))

    if (!user) {
      console.log(`User not found with email/username: ${credentials.emailOrUsername}`)
      return null
    }

    // Verify password
    const isPasswordValid = await verifyPassword(credentials.password, user.passwordHash)

    if (!isPasswordValid) {
      console.log(`Invalid password for user: ${user.id}`)
      return null
    }

    console.log(`User authenticated: ${user.id}`)
    return user
  } catch (error) {
    console.error(`Error authenticating user ${credentials.emailOrUsername}:`, error)
    return null
  }
}

// Update user
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  try {
    console.log(`Updating user: ${userId}`)

    // Get current user
    const user = await getUserById(userId)

    if (!user) {
      console.log(`User not found for update: ${userId}`)
      return null
    }

    // Create updated user
    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    // Store updated user
    await redis.set(`${USER_PREFIX}${userId}`, updatedUser)

    // Update email index if email changed
    if (updates.email && updates.email !== user.email) {
      await redis.del(`${EMAIL_INDEX_PREFIX}${user.email}`)
      await redis.set(`${EMAIL_INDEX_PREFIX}${updates.email.toLowerCase()}`, userId)
    }

    // Update username index if username changed
    if (updates.username && updates.username !== user.username) {
      await redis.del(`${USERNAME_INDEX_PREFIX}${user.username}`)
      await redis.set(`${USERNAME_INDEX_PREFIX}${updates.username.toLowerCase()}`, userId)
    }

    console.log(`User updated: ${userId}`)
    return updatedUser
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error)
    return null
  }
}

// Change password
updateUser.changePassword = async (userId: string, newPassword: string): Promise<boolean> => {
  try {
    console.log(`Changing password for user: ${userId}`)

    // Hash new password
    const passwordHash = await hashPassword(newPassword)

    // Update user with new password hash
    const updatedUser = await updateUser(userId, { passwordHash })

    return !!updatedUser
  } catch (error) {
    console.error(`Error changing password for user ${userId}:`, error)
    return false
  }
}

// Delete user
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    console.log(`Deleting user: ${userId}`)

    // Get user
    const user = await getUserById(userId)

    if (!user) {
      console.log(`User not found for deletion: ${userId}`)
      return false
    }

    // Delete email and username indexes
    await redis.del(`${EMAIL_INDEX_PREFIX}${user.email}`)
    await redis.del(`${USERNAME_INDEX_PREFIX}${user.username}`)

    // Delete user
    await redis.del(`${USER_PREFIX}${userId}`)

    console.log(`User deleted: ${userId}`)
    return true
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error)
    return false
  }
}

// Set user verification status
export async function setUserVerified(userId: string, isVerified = true): Promise<boolean> {
  try {
    console.log(`Setting verification status to ${isVerified} for user: ${userId}`)

    // Update user
    const updatedUser = await updateUser(userId, { isVerified })

    return !!updatedUser
  } catch (error) {
    console.error(`Error setting verification status for user ${userId}:`, error)
    return false
  }
}

// Get all users
export async function getAllUsers(): Promise<User[]> {
  try {
    console.log("Getting all users")

    // Get all user keys
    const keys = await redis.keys(`${USER_PREFIX}*`)

    if (!keys.length) {
      console.log("No users found")
      return []
    }

    // Get all users
    const users = await Promise.all(keys.map((key) => redis.get<User>(key)))

    // Filter out null values
    const validUsers = users.filter(Boolean) as User[]

    console.log(`Found ${validUsers.length} users`)
    return validUsers
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}

// Verify email - ADDED TO FIX DEPLOYMENT ERROR
export async function verifyEmail(userId: string): Promise<{ success: boolean; message?: string; user?: User }> {
  try {
    console.log(`Verifying email for user: ${userId}`)

    // Get user
    const user = await getUserById(userId)

    if (!user) {
      console.log(`User not found for email verification: ${userId}`)
      return { success: false, message: "User not found" }
    }

    // Update user verification status
    const success = await setUserVerified(userId, true)

    if (!success) {
      console.log(`Failed to verify email for user: ${userId}`)
      return { success: false, message: "Failed to verify email" }
    }

    // Get updated user
    const updatedUser = await getUserById(userId)

    console.log(`Email verified for user: ${userId}`)
    return { success: true, user: updatedUser }
  } catch (error) {
    console.error(`Error verifying email for user ${userId}:`, error)
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

      const updatedUser = await updateUser(userId, { isVerified: true })
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

    const updatedUser = await updateUser(tokenUserId, { isVerified: true })

    // Delete the token
    await redis.del(`verification:${token}`)
    console.log(`User ${tokenUserId} marked as verified and token deleted`)

    return updatedUser
  } catch (error) {
    console.error("Error updating user verification:", error)
    return null
  }
}

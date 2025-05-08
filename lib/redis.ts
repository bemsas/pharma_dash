import { Redis } from "@upstash/redis"

// Initialize Redis client using environment variables
// These are automatically added by the Vercel Upstash integration
export const redis = Redis.fromEnv()

// Utility functions for common Redis operations
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key)
    return data as T
  } catch (error) {
    console.error("Redis get error:", error)
    return null
  }
}

export async function setCache<T>(key: string, data: T, expireInSeconds?: number): Promise<void> {
  try {
    if (expireInSeconds) {
      await redis.set(key, data, { ex: expireInSeconds })
    } else {
      await redis.set(key, data)
    }
  } catch (error) {
    console.error("Redis set error:", error)
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error("Redis delete error:", error)
  }
}

// For handling multiple keys with the same prefix
export async function getKeysByPattern(pattern: string): Promise<string[]> {
  try {
    return await redis.keys(pattern)
  } catch (error) {
    console.error("Redis keys error:", error)
    return []
  }
}

// Increment a counter (useful for analytics)
export async function incrementCounter(key: string, amount = 1): Promise<number> {
  try {
    return await redis.incrby(key, amount)
  } catch (error) {
    console.error("Redis increment error:", error)
    return 0
  }
}

export async function getCachedData<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const data = await redis.get(key)
    return data ? (data as T) : defaultValue
  } catch (error) {
    console.error("Redis get error:", error)
    return defaultValue
  }
}

export async function cacheData<T>(key: string, data: T, expireInSeconds?: number): Promise<void> {
  try {
    if (expireInSeconds) {
      await redis.set(key, data, { ex: expireInSeconds })
    } else {
      await redis.set(key, data)
    }
  } catch (error) {
    console.error("Redis set error:", error)
  }
}

export async function getCachedDataWithPattern<T>(pattern: string): Promise<T[]> {
  try {
    const keys = await redis.keys(pattern)
    if (!keys || keys.length === 0) {
      return []
    }

    const values = await Promise.all(keys.map((key) => redis.get(key)))
    return values.filter((value) => value !== null) as T[]
  } catch (error) {
    console.error("Redis get error:", error)
    return []
  }
}

export async function redisExecute<T>(operation: () => Promise<T>, defaultValue: T, description: string): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error(`Redis operation failed: ${description}`, error)
    return defaultValue
  }
}

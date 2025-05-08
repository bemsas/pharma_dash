import { randomBytes, pbkdf2Sync } from "crypto"

// Hash a password with a random salt using PBKDF2
export function hashPassword(password: string): string {
  // Generate a random salt
  const salt = randomBytes(16).toString("hex")

  // Hash the password with PBKDF2 (100,000 iterations, 64 byte length, sha512 algorithm)
  const hash = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")

  // Return the salt and hash together
  return `${salt}:${hash}`
}

// A simple constant-time comparison function to replace timingSafeEqual
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Immediately return false if lengths differ
    // Still process the comparison to maintain constant time
    let result = 1
    for (let i = 0; i < a.length; i++) {
      result &= a.charCodeAt(Math.min(i, a.length - 1)) === b.charCodeAt(Math.min(i, b.length - 1)) ? 1 : 0
    }
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    // Use bitwise XOR to compare characters
    // This will be 0 only if the characters are identical
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  // If result is 0, all characters matched
  return result === 0
}

// Verify a password against a hash
export function verifyPassword(password: string, hashedPassword: string): boolean {
  try {
    // Split the stored hash into its parts
    const [salt, storedHash] = hashedPassword.split(":")

    // Hash the provided password with the same salt and parameters
    const hash = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")

    // Compare the hashes in constant time to prevent timing attacks
    return constantTimeCompare(hash, storedHash)
  } catch (error) {
    console.error("Error verifying password:", error)
    return false
  }
}

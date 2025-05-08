import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Debounce function to limit the frequency of function calls
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Safe window resize handler
export function createResizeHandler(callback: () => void): () => void {
  let frame: number | null = null

  const handler = () => {
    if (frame) {
      cancelAnimationFrame(frame)
    }

    frame = requestAnimationFrame(() => {
      callback()
      frame = null
    })
  }

  return handler
}

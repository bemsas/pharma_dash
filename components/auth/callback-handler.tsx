"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

interface CallbackHandlerProps {
  onCallback: (callbackUrl: string) => void
}

export function CallbackHandler({ onCallback }: CallbackHandlerProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl") || "/"
    onCallback(callbackUrl)
  }, [searchParams, onCallback])

  return null
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleFavorite } from "@/app/actions/favorites-actions"

interface FavoriteButtonProps {
  company: string
  initialIsFavorite: boolean
}

export function FavoriteButton({ company, initialIsFavorite }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    setIsFavorite(initialIsFavorite)
  }, [initialIsFavorite])

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    setIsLoading(true)
    try {
      const result = await toggleFavorite(company)
      if (result.success) {
        setIsFavorite(result.isFavorite)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star className={`h-5 w-5 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
    </Button>
  )
}

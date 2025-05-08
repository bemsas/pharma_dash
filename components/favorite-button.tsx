"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleFavorite } from "@/app/actions/favorites-actions"
import { useToast } from "@/components/ui/use-toast"

interface FavoriteButtonProps {
  companyName: string
  initialIsFavorite: boolean
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function FavoriteButton({
  companyName,
  initialIsFavorite,
  variant = "ghost",
  size = "icon",
  className,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleToggleFavorite = async () => {
    try {
      setIsLoading(true)
      const result = await toggleFavorite(companyName)

      if (result.success) {
        setIsFavorite(result.isFavorite)
        toast({
          title: result.isFavorite ? "Added to favorites" : "Removed from favorites",
          description: result.message,
          duration: 3000,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star className={`h-4 w-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
      <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
    </Button>
  )
}

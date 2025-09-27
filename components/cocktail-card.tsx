"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Cocktail } from "@/types/cocktail"

interface CocktailCardProps {
  cocktail: Cocktail
  onClick: () => void
  lowIngredients?: string[]
  onLowIngredientClick?: () => void
}

export default function CocktailCard({
  cocktail,
  onClick,
  lowIngredients = [],
  onLowIngredientClick,
}: CocktailCardProps) {
  const [imageSrc, setImageSrc] = useState<string>("")
  const [imageLoaded, setImageLoaded] = useState<boolean>(false)

  const findImagePath = async (cocktail: Cocktail): Promise<string> => {
    if (!cocktail.image) {
      return `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(cocktail.name)}`
    }

    // Extrahiere den Dateinamen aus dem Pfad
    const filename = cocktail.image.split("/").pop() || cocktail.image
    const filenameWithoutExt = filename.replace(/\.[^/.]+$/, "") // Entferne Dateierweiterung
    const originalExt = filename.split(".").pop()?.toLowerCase() || ""

    // Alle gängigen Bildformate
    const imageExtensions = ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg"]

    // Verwende originale Erweiterung zuerst, dann alle anderen
    const extensionsToTry = originalExt
      ? [originalExt, ...imageExtensions.filter((ext) => ext !== originalExt)]
      : imageExtensions

    // Verschiedene Basispfade für alkoholische und alkoholfreie Cocktails
    const basePaths = [
      "/images/cocktails/", // Alkoholische Cocktails
      "/", // Alkoholfreie Cocktails (direkt im public/)
      "", // Ohne Pfad
      "/public/images/cocktails/", // Vollständiger Pfad
      "/public/", // Public Verzeichnis
    ]

    const strategies: string[] = []

    // Generiere alle Kombinationen von Pfaden und Dateierweiterungen
    for (const basePath of basePaths) {
      for (const ext of extensionsToTry) {
        strategies.push(`${basePath}${filenameWithoutExt}.${ext}`)
      }
      // Auch den originalen Dateinamen probieren
      strategies.push(`${basePath}${filename}`)
    }

    // Zusätzliche spezielle Strategien
    strategies.push(
      // Originaler Pfad
      cocktail.image,
      // Ohne führenden Slash
      cocktail.image.startsWith("/") ? cocktail.image.substring(1) : cocktail.image,
      // Mit führendem Slash
      cocktail.image.startsWith("/") ? cocktail.image : `/${cocktail.image}`,
      // API-Pfad als Fallback
      `/api/image?path=${encodeURIComponent(`/home/pi/cocktailbot/cocktailbot-main/public/images/cocktails/${filename}`)}`,
      `/api/image?path=${encodeURIComponent(`/home/pi/cocktailbot/cocktailbot-main/public/${filename}`)}`,
    )

    console.log(`[v0] Testing ${strategies.length} image strategies for ${cocktail.name}:`, strategies.slice(0, 5))

    const uniqueStrategies = Array.from(new Set(strategies))

    for (let i = 0; i < uniqueStrategies.length; i++) {
      const testPath = uniqueStrategies[i]

      try {
        const img = new Image()
        img.crossOrigin = "anonymous" // Für CORS

        const loadPromise = new Promise<boolean>((resolve) => {
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
        })

        img.src = testPath
        const success = await loadPromise

        if (success) {
          console.log(`[v0] ✅ Found working image for ${cocktail.name}: ${testPath}`)
          return testPath
        }
      } catch (error) {
        // Fehler ignorieren und nächste Strategie versuchen
      }
    }

    // Fallback auf Platzhalter
    console.log(`[v0] ❌ No working image found for ${cocktail.name}, using placeholder`)
    return `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(cocktail.name)}`
  }

  useEffect(() => {
    const loadImage = async () => {
      const imagePath = await findImagePath(cocktail)
      setImageSrc(imagePath)
      setImageLoaded(true)
    }

    loadImage()
  }, [cocktail])

  const handleImageError = () => {
    console.log(`[v0] ❌ Final image error for ${cocktail.name}: ${imageSrc}`)
    const placeholder = `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(cocktail.name)}`
    setImageSrc(placeholder)
  }

  const handleImageLoad = () => {
    console.log(`[v0] ✅ Image loaded successfully for ${cocktail.name}: ${imageSrc}`)
  }

  const hasLowIngredients = cocktail.recipe.some((item) => !item.manual && lowIngredients.includes(item.ingredientId))

  const handleLowIngredientClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Verhindere dass der Cocktail-Click ausgelöst wird
    if (onLowIngredientClick) {
      onLowIngredientClick()
    }
  }

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer bg-black border-[hsl(var(--cocktail-card-border))] hover:border-[hsl(var(--cocktail-primary))]/50"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={cocktail.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={handleImageError}
          onLoad={handleImageLoad}
          crossOrigin="anonymous"
          key={`${cocktail.image}-${imageSrc}`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        <Badge className="absolute top-3 right-3 bg-[hsl(var(--cocktail-primary))] text-black font-medium shadow-lg">
          {cocktail.alcoholic ? "Alkoholisch" : "Alkoholfrei"}
        </Badge>

        {hasLowIngredients && (
          <div
            className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium cursor-pointer hover:bg-red-600 transition-colors shadow-lg"
            onClick={handleLowIngredientClick}
            title="Klicken um zu den Füllständen zu gelangen"
          >
            Niedrige Füllstände
          </div>
        )}

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="absolute bottom-2 left-2 text-xs bg-black/70 text-white p-1 rounded">
            {imageLoaded ? "✅" : "🔄"}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-[hsl(var(--cocktail-text))] line-clamp-1 group-hover:text-[hsl(var(--cocktail-primary))] transition-colors duration-200">
            {cocktail.name}
          </h3>
          <p className="text-sm text-[hsl(var(--cocktail-text-muted))] line-clamp-2 leading-relaxed">
            {cocktail.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

import { getIngredientLevels } from "@/lib/ingredient-level-service"
import { pumpConfig } from "@/data/pump-config"
import type { Cocktail } from "@/types/cocktail"

export interface IngredientAvailability {
  canMake: boolean
  lowIngredients: string[] // Zutaten, die für genau einen Cocktail reichen
  missingIngredients: string[] // Zutaten, die nicht ausreichen
}

export function checkCocktailAvailability(cocktail: Cocktail): IngredientAvailability {
  const levels = getIngredientLevels()
  const lowIngredients: string[] = []
  const missingIngredients: string[] = []

  // Nur automatische Zutaten prüfen (die von der Maschine dispensiert werden)
  const automaticIngredients = cocktail.recipe.filter((ingredient) => ingredient.type === "automatic")

  for (const ingredient of automaticIngredients) {
    // Finde die entsprechende Pumpe für diese Zutat
    const pump = pumpConfig.find((p) => p.ingredient === ingredient.ingredientId && p.enabled !== false)

    if (!pump) {
      // Zutat ist nicht konfiguriert oder deaktiviert
      missingIngredients.push(ingredient.ingredientId)
      continue
    }

    // Finde den aktuellen Füllstand für diese Pumpe
    const level = levels.find((l) => l.pumpId === pump.id)

    if (!level) {
      // Kein Füllstand gefunden
      missingIngredients.push(ingredient.ingredientId)
      continue
    }

    const requiredAmount = ingredient.amount
    const availableAmount = level.currentLevel

    if (availableAmount < requiredAmount) {
      // Nicht genug für diesen Cocktail
      missingIngredients.push(ingredient.ingredientId)
    } else if (availableAmount < requiredAmount * 2) {
      // Reicht für einen Cocktail, aber wenig
      lowIngredients.push(ingredient.ingredientId)
    }
  }

  const canMake = missingIngredients.length === 0

  return {
    canMake,
    lowIngredients,
    missingIngredients,
  }
}

export function getIngredientDisplayName(ingredientId: string): string {
  return ingredientId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

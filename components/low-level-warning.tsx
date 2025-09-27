import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import type { IngredientAvailability } from "@/lib/ingredient-availability"

interface LowLevelWarningProps {
  availability: IngredientAvailability
}

export default function LowLevelWarning({ availability }: LowLevelWarningProps) {
  // Keine Warnung anzeigen, wenn genug Zutaten da sind
  if (availability.canMake && availability.lowIngredients.length === 0) {
    return null
  }

  // Rot: Kann nicht gemacht werden (fehlende Zutaten)
  if (!availability.canMake) {
    return (
      <Badge className="absolute top-2 left-2 bg-red-600 text-white font-medium shadow-lg flex items-center gap-1 text-xs px-2 py-1">
        <AlertTriangle className="h-3 w-3" />
        Niedriger Füllstand
      </Badge>
    )
  }

  // Orange: Kann gemacht werden, aber niedrige Füllstände
  if (availability.lowIngredients.length > 0) {
    return (
      <Badge className="absolute top-2 left-2 bg-orange-500 text-white font-medium shadow-lg flex items-center gap-1 text-xs px-2 py-1">
        <AlertTriangle className="h-3 w-3" />
        Niedriger Füllstand
      </Badge>
    )
  }

  return null
}

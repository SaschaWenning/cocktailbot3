import { type NextRequest, NextResponse } from "next/server"
import { getAllCocktails } from "@/lib/cocktail-machine-server"
import { saveOrUpdateCocktail, deleteCocktailFromJSON } from "@/lib/cocktail-initialization"

export async function GET() {
  try {
    const cocktails = await getAllCocktails()
    return NextResponse.json({ success: true, cocktails })
  } catch (error) {
    console.error("Error getting cocktails:", error)
    return NextResponse.json({ success: false, error: "Failed to get cocktails" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { cocktail } = await request.json()

    if (!cocktail || !cocktail.id || !cocktail.name) {
      return NextResponse.json({ success: false, error: "Invalid cocktail data" }, { status: 400 })
    }

    console.log(`[v0] API: Saving/updating cocktail ${cocktail.name}`)

    await saveOrUpdateCocktail(cocktail)

    return NextResponse.json({
      success: true,
      message: `Cocktail ${cocktail.name} successfully saved`,
    })
  } catch (error) {
    console.error("[v0] API Error saving cocktail:", error)
    return NextResponse.json({ success: false, error: "Failed to save cocktail" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cocktailId = searchParams.get("id")

    if (!cocktailId) {
      return NextResponse.json({ success: false, error: "Cocktail ID is required" }, { status: 400 })
    }

    console.log(`[v0] API: Deleting cocktail ${cocktailId}`)

    await deleteCocktailFromJSON(cocktailId)

    return NextResponse.json({
      success: true,
      message: `Cocktail ${cocktailId} successfully deleted`,
    })
  } catch (error) {
    console.error("[v0] API Error deleting cocktail:", error)
    return NextResponse.json({ success: false, error: "Failed to delete cocktail" }, { status: 500 })
  }
}

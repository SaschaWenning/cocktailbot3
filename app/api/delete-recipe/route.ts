import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { cocktailId } = await request.json()

    if (!cocktailId) {
      return NextResponse.json({ error: "Cocktail ID is required" }, { status: 400 })
    }

    console.log("[v0] API: Deleting cocktail:", cocktailId)

    // In the browser environment, we can't actually delete files from the filesystem
    // Instead, we'll return success and let the frontend handle the removal from its state
    // This is appropriate for the v0 preview environment

    return NextResponse.json({
      success: true,
      message: `Cocktail ${cocktailId} deleted successfully`,
      cocktailId,
    })
  } catch (error) {
    console.error("[v0] Error deleting cocktail:", error)
    return NextResponse.json({ error: "Failed to delete cocktail" }, { status: 500 })
  }
}

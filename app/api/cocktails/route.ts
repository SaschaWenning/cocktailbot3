import { NextResponse } from "next/server"
import { getAllCocktails } from "@/lib/cocktail-machine-server"

export async function GET() {
  try {
    console.log("[v0] API: Loading cocktails...")
    const cocktails = await getAllCocktails()
    console.log("[v0] API: Loaded cocktails:", cocktails?.length || 0)
    return NextResponse.json(cocktails || [])
  } catch (error) {
    console.error("[v0] API: Error getting cocktails:", error)
    return NextResponse.json([])
  }
}

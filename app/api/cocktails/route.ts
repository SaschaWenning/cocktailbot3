import { NextResponse } from "next/server"
import cocktailsData from "@/data/cocktails.json"

export async function GET() {
  try {
    console.log("[v0] API: Loading cocktails...")
    const cocktails = cocktailsData
    console.log("[v0] API: Loaded cocktails:", cocktails?.length || 0)
    return NextResponse.json(cocktails || [])
  } catch (error) {
    console.error("[v0] API: Error getting cocktails:", error)
    return NextResponse.json([])
  }
}

import { NextResponse } from "next/server";
import { getAllRecipes, saveRecipe } from "@/lib/db";
import { SavedRecipe } from "@/types/recipe";

export async function GET() {
  const recipes = getAllRecipes();
  return NextResponse.json(recipes);
}

export async function POST(request: Request) {
  const recipe: SavedRecipe = await request.json();
  saveRecipe(recipe);
  return NextResponse.json({ success: true });
}

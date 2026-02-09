import { NextResponse } from "next/server";
import { getRecipesByUser, saveRecipe } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { SavedRecipe } from "@/types/recipe";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json([], { status: 401 });
  return NextResponse.json(getRecipesByUser(session.userId));
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const recipe: SavedRecipe = await request.json();
  recipe.userId = session.userId;
  saveRecipe(recipe);
  return NextResponse.json({ success: true });
}

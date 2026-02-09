import { NextRequest, NextResponse } from "next/server";
import { getRecipesByUser, saveRecipe, deleteRecipe } from "@/lib/db";
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

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await request.json();
  const deleted = deleteRecipe(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

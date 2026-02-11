import { NextRequest, NextResponse } from "next/server";
import { getRecipesByUser, saveRecipe, deleteRecipe } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { SavedRecipe } from "@/types/recipe";

async function requireAuth() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function GET() {
  const session = await requireAuth();
  if (!session) return NextResponse.json([], { status: 401 });
  return NextResponse.json(getRecipesByUser(session.userId));
}

export async function POST(request: Request) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const recipe: SavedRecipe = await request.json();
  recipe.userId = session.userId;
  saveRecipe(recipe);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  if (!deleteRecipe(id, session.userId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

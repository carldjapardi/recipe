import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { SavedRecipe } from "@/types/recipe";

const DB_PATH = join(process.cwd(), "data", "recipes.json");

function ensureDb(): void {
  const dir = join(process.cwd(), "data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(DB_PATH)) {
    writeFileSync(DB_PATH, "[]", "utf-8");
  }
}

export function getAllRecipes(): SavedRecipe[] {
  ensureDb();
  const data = readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

export function getRecipesByUser(userId: string): SavedRecipe[] {
  return getAllRecipes().filter((r) => r.userId === userId);
}

export function saveRecipe(recipe: SavedRecipe): void {
  ensureDb();
  const recipes = getAllRecipes();
  const existing = recipes.findIndex((r) => r.id === recipe.id);
  if (existing >= 0) {
    recipes[existing] = recipe;
  } else {
    recipes.unshift(recipe);
  }
  writeFileSync(DB_PATH, JSON.stringify(recipes, null, 2), "utf-8");
}

export function deleteRecipe(id: string, userId?: string): boolean {
  ensureDb();
  const recipes = getAllRecipes();
  const match = recipes.find((r) => r.id === id);
  if (!match || (userId && match.userId !== userId)) return false;
  const filtered = recipes.filter((r) => r.id !== id);
  writeFileSync(DB_PATH, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

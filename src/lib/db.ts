import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { SavedRecipe } from "@/types/recipe";

const DB_PATH = join(process.cwd(), "data", "recipes.json");

function ensureDb(): void {
  if (!existsSync(join(process.cwd(), "data"))) {
    const { mkdirSync } = require("fs");
    mkdirSync(join(process.cwd(), "data"), { recursive: true });
  }
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

export function deleteRecipe(id: string): boolean {
  ensureDb();
  const recipes = getAllRecipes();
  const filtered = recipes.filter((r) => r.id !== id);
  if (filtered.length === recipes.length) return false;
  writeFileSync(DB_PATH, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

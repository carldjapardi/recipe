export interface Recipe {
  title: string;
  description: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  ingredients: string[];
  steps: string[];
}

export interface SavedRecipe extends Recipe {
  id: string;
  sourceUrl: string;
  userId?: string;
}

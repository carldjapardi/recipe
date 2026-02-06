import { Recipe } from "@/types/recipe";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="w-full max-w-xl space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <h2 className="text-2xl font-bold">{recipe.title}</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          {recipe.description}
        </p>
      </div>

      <div className="flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        {recipe.servings && <span>Servings: {recipe.servings}</span>}
        {recipe.prepTime && <span>Prep: {recipe.prepTime}</span>}
        {recipe.cookTime && <span>Cook: {recipe.cookTime}</span>}
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Ingredients</h3>
        <ul className="list-inside list-disc space-y-1 text-zinc-700 dark:text-zinc-300">
          {recipe.ingredients.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Steps</h3>
        <ol className="list-inside list-decimal space-y-2 text-zinc-700 dark:text-zinc-300">
          {recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

import { SavedRecipe } from "@/types/recipe";

export function RecipeDetail({
  recipe,
  onBack,
}: {
  recipe: SavedRecipe;
  onBack: () => void;
}) {
  return (
    <div className="w-full max-w-2xl">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-amber-600 hover:underline"
      >
        &larr; Back to all recipes
      </button>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-bold text-stone-900">{recipe.title}</h2>
        <p className="mt-1 text-sm text-stone-500">{recipe.description}</p>

        <a
          href={recipe.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-amber-600 hover:underline"
        >
          View original on Instagram &rarr;
        </a>

        <div className="mt-4 flex flex-wrap gap-3 border-t border-stone-100 pt-4 text-sm text-stone-600">
          <span>Servings: {recipe.servings}</span>
          <span className="text-stone-300">|</span>
          <span>Prep: {recipe.prepTime}</span>
          <span className="text-stone-300">|</span>
          <span>Cook: {recipe.cookTime}</span>
        </div>

        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-stone-800">
            Ingredients
          </h3>
          <ul className="space-y-1 text-sm text-stone-700">
            {recipe.ingredients.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-500">&#8226;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-stone-800">Steps</h3>
          <ol className="space-y-2 text-sm text-stone-700">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-medium text-amber-700">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

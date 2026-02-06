import { SavedRecipe } from "@/types/recipe";

export function RecipeCard({
  recipe,
  onClick,
}: {
  recipe: SavedRecipe;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full cursor-pointer rounded-xl border border-stone-200 bg-white p-5 text-left transition hover:border-amber-300 hover:shadow-md"
    >
      <h3 className="text-base font-semibold text-stone-900 leading-snug">
        {recipe.title}
      </h3>
      <p className="mt-1 text-xs text-stone-500 line-clamp-2">
        {recipe.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Tag label={recipe.cookTime || "N/A"} icon="🕐" />
        <Tag label={`${recipe.ingredients.length} ingredients`} icon="🥘" />
        <Tag label={`${recipe.servings} servings`} icon="🍽" />
        <Tag label={`${recipe.steps.length} steps`} icon="📋" />
      </div>
      <p className="mt-3 truncate text-xs text-amber-600 hover:underline">
        {recipe.sourceUrl}
      </p>
    </button>
  );
}

function Tag({ label, icon }: { label: string; icon: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600">
      <span>{icon}</span>
      {label}
    </span>
  );
}

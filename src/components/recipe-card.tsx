import { SavedRecipe } from "@/types/recipe";

export function RecipeCard({
  recipe,
  onClick,
  onDelete,
}: {
  recipe: SavedRecipe;
  onClick: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="relative rounded-xl border border-stone-200 bg-white p-5 transition hover:border-amber-300 hover:shadow-md">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-3 right-3 rounded-md p-1 text-stone-300 hover:bg-red-50 hover:text-red-500"
        title="Delete recipe"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        onClick={onClick}
        className="w-full cursor-pointer text-left"
      >
        <h3 className="text-base font-semibold text-stone-900 leading-snug pr-6">
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
    </div>
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

import { FireIcon } from "@heroicons/react/24/outline";
import { Recipe } from "@/types/recipe";

interface RecipeListItemProps {
  recipe: Recipe;
  onClick: () => void;
}

export function RecipeListItem({ recipe, onClick }: RecipeListItemProps) {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl border border-card-border bg-card hover:border-primary/30 cursor-pointer"
    >
      <h2 className="font-semibold text-lg">{recipe.name}</h2>
      {recipe.description && (
        <p className="text-gray-800 text-sm mb-3">{recipe.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <FireIcon className="w-4 h-4 text-gray-800" />
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`h-3 w-3 rounded-full ${
                star <= recipe.effort
                  ? recipe.effort === 1
                    ? "bg-green-400"
                    : recipe.effort === 2
                    ? "bg-green-500"
                    : recipe.effort === 3
                    ? "bg-yellow-500"
                    : recipe.effort === 4
                    ? "bg-orange-500"
                    : "bg-red-500"
                  : "bg-gray-100"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 border border-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 
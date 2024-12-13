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
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-lg truncate">{recipe.name}</h2>
          {recipe.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {recipe.description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-3">
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

          <div className="flex flex-wrap justify-end gap-1.5">
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
    </div>
  );
} 
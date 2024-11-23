import { FireIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Recipe } from "@/types/recipe";

interface RecipeShowProps {
  recipe: Recipe;
  isFiltered: boolean;
  onBack: () => void;
}

export function RecipeShow({ recipe, isFiltered, onBack }: RecipeShowProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to list
        </button>
        {!isFiltered && (
          <span className="text-sm text-yellow-600">
            (This recipe is currently filtered out)
          </span>
        )}
      </div>
      
      <div className="p-6 rounded-xl border border-card-border bg-card">
        <h1 className="text-2xl font-semibold mb-4">{recipe.name}</h1>
        
        {recipe.description && (
          <p className="text-gray-800 mb-6">{recipe.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 mb-6">
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

        {/* Add more recipe details here based on your data structure */}
      </div>
    </div>
  );
} 
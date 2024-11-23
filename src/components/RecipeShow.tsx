import { FireIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Recipe } from "@/types/recipe";

interface RecipeShowProps {
  recipe: Recipe;
  isFiltered: boolean;
  onBack: () => void;
  tagFilters: Record<string, "disabled" | "whitelist" | "blacklist">;
  onTagChange: (tag: string) => void;
}

export function RecipeShow({ 
  recipe, 
  isFiltered, 
  onBack,
  tagFilters,
  onTagChange 
}: RecipeShowProps) {
  const getTagClassName = (tag: string) => {
    const state = tagFilters[tag] || "disabled";
    
    if (state === "disabled") {
      return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
    }
    if (state === "whitelist") {
      return "bg-blue-500 text-white border-blue-600";
    }
    if (state === "blacklist") {
      return "bg-white text-red-600 border-red-300 line-through hover:bg-red-50";
    }
    return "";
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to list
        </button>
        {!isFiltered && (
          <span className="text-sm px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg">
            This recipe is currently filtered out
          </span>
        )}
      </div>
      
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-gray-900">{recipe.name}</h1>
          {recipe.description && (
            <p className="text-gray-600 text-lg leading-relaxed">{recipe.description}</p>
          )}
        </div>

        {/* Metadata Section */}
        <div className="space-y-6">
          {/* Effort Level */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Effort Level
            </h3>
            <div className="flex items-center gap-2">
              <FireIcon className="w-5 h-5 text-gray-700" />
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`h-3.5 w-3.5 rounded-full ${
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
              <span className="text-sm text-gray-600 ml-2">
                {recipe.effort === 1 ? "Very Easy" :
                 recipe.effort === 2 ? "Easy" :
                 recipe.effort === 3 ? "Moderate" :
                 recipe.effort === 4 ? "Challenging" :
                 "Difficult"}
              </span>
            </div>
          </div>

          {/* Ingredients/Tags */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Key Ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagChange(tag)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${getTagClassName(tag)}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Content Section */}
        <div className="pt-6 border-t">
          {/* Add your recipe details here (ingredients list, steps, etc.) */}
        </div>
      </div>
    </div>
  );
} 
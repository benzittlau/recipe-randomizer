"use client";

import { useState, useMemo } from "react";
import { recipes } from "@/data/recipes";
import { RecipeFilters } from "@/components/RecipeFilters";
import { FireIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [effortRange, setEffortRange] = useState<[number, number]>([1, 5]);

  const clearFilters = () => {
    setSelectedTags([]);
    setEffortRange([1, 5]);
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const effortMatch =
        recipe.effort >= effortRange[0] && recipe.effort <= effortRange[1];
      const tagsMatch =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => recipe.tags.includes(tag));
      return effortMatch && tagsMatch;
    });
  }, [effortRange, selectedTags]);

  const selectRandomRecipe = () => {
    const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
    setSelectedRecipe(filteredRecipes[randomIndex].id);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <RecipeFilters
        allTags={Array.from(new Set(recipes.flatMap((r) => r.tags))).sort()}
        selectedTags={selectedTags}
        effortRange={effortRange}
        onTagChange={handleTagChange}
        onEffortRangeChange={setEffortRange}
        onClearFilters={clearFilters}
        showClearFilters={selectedTags.length > 0 || effortRange[0] !== 1 || effortRange[1] !== 5}
      />

      <div className="flex-1 p-4">
        <div className="space-y-2">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className={`p-4 rounded-lg border ${
                selectedRecipe === recipe.id
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="font-semibold">{recipe.name}</h2>
              {recipe.description && (
                <p className="text-gray-600 text-sm mb-2">
                  {recipe.description}
                </p>
              )}

              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-1.5">
                  <FireIcon className="w-4 h-4 text-gray-600" />
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`h-4 w-4 rounded-full ${
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
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 p-4 bg-white border-t">
        <button
          onClick={selectRandomRecipe}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Pick Random Recipe
        </button>
      </div>
    </main>
  );
}

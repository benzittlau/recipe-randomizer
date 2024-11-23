"use client";

import { useState, useMemo } from "react";
import { recipes } from "@/data/recipes";
import { RecipeFilters } from "@/components/RecipeFilters";
import { FireIcon } from "@heroicons/react/24/outline";
import { useClientState } from '@/hooks/useClientState';

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [selectedTags, setSelectedTags, isLoadingTags] = useClientState<string[]>('selectedTags', []);
  const [effortRange, setEffortRange, isLoadingEffort] = useClientState<[number, number]>('effortRange', [1, 5]);

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

  if (isLoadingTags || isLoadingEffort) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="p-4 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  const clearFilters = () => {
    setSelectedTags([]);
    setEffortRange([1, 5]);
  };

  const selectRandomRecipe = () => {
    const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
    setSelectedRecipe(filteredRecipes[randomIndex].id);

    setTimeout(() => {
      const selectedRecipe = document.querySelector('[data-selected="true"]');
      const filtersElement = document.querySelector(".filters-container");

      if (selectedRecipe && filtersElement) {
        const filtersHeight = filtersElement.getBoundingClientRect().height;

        window.scrollTo({
          top:
            selectedRecipe.getBoundingClientRect().top +
            window.scrollY -
            filtersHeight -
            16,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <main className="min-h-screen flex flex-col bg-background overscroll-contain">
      <div className="max-w-3xl w-full mx-auto flex flex-col flex-1">
        <RecipeFilters
          className="filters-container backdrop-blur-sm bg-card/80 border-card-border"
          allTags={Array.from(new Set(recipes.flatMap((r) => r.tags))).sort()}
          selectedTags={selectedTags}
          effortRange={effortRange}
          onTagChange={handleTagChange}
          onEffortRangeChange={setEffortRange}
          onClearFilters={clearFilters}
          showClearFilters={
            selectedTags.length > 0 ||
            effortRange[0] !== 1 ||
            effortRange[1] !== 5
          }
        />

        <div className="flex-1 p-4">
          <div className="space-y-3">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                data-selected={selectedRecipe === recipe.id}
                className={`p-4 rounded-xl border transition-all ${
                  selectedRecipe === recipe.id
                    ? "bg-blue-50 border-primary shadow-sm"
                    : "bg-card border-card-border hover:border-primary/30"
                }`}
              >
                <h2 className="font-semibold text-lg">{recipe.name}</h2>
                {recipe.description && (
                  <p className="text-gray-800 text-sm mb-3">
                    {recipe.description}
                  </p>
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
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 p-4 bg-gradient-to-t from-background to-background/80 backdrop-blur-sm">
          <button
            onClick={selectRandomRecipe}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm"
          >
            Pick Random Recipe
          </button>
        </div>
      </div>
    </main>
  );
}

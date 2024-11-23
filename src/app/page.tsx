"use client";

import { useState, useMemo } from "react";
import { recipes } from "@/data/recipes";
import { RecipeFilters } from "@/components/RecipeFilters";
import { FireIcon } from "@heroicons/react/24/outline";
import { useClientState } from "@/hooks/useClientState";

type TagFilterState = "disabled" | "whitelist" | "blacklist";
type TagFilters = Record<string, TagFilterState>;

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [tagFilters, setTagFilters, isLoadingTags] = useClientState<TagFilters>(
    "tagFilters",
    {}
  );
  const [effortRange, setEffortRange, isLoadingEffort] = useClientState<
    [number, number]
  >("effortRange", [1, 5]);

  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((recipe) => {
        const effortMatch =
          recipe.effort >= effortRange[0] && recipe.effort <= effortRange[1];

        const tagsMatch = Object.entries(tagFilters).every(([tag, state]) => {
          if (state === "disabled") return true;
          if (state === "whitelist") return recipe.tags.includes(tag);
          if (state === "blacklist") return !recipe.tags.includes(tag);
          return true;
        });

        return effortMatch && tagsMatch;
      })
      .sort((a, b) => {
        const effortDiff = a.effort - b.effort;
        if (effortDiff === 0) {
          return a.name.localeCompare(b.name);
        }
        return effortDiff;
      });
  }, [effortRange, tagFilters]);

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
    setTagFilters({});
    setEffortRange([1, 5]);
  };

  const scrollToSelectedRecipe = () => {
    const selectedRecipe = document.querySelector('[data-selected="true"]');
    const scrollContainer = document.querySelector(".recipe-scroll-container");

    if (selectedRecipe && scrollContainer) {
      const recipeRect = selectedRecipe.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      // Calculate the ideal scroll position (recipe at the top of the viewport)
      const idealScrollTop =
        scrollContainer.scrollTop + (recipeRect.top - containerRect.top);

      // Calculate the maximum scroll position
      const maxScroll =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;

      // Clamp the scroll position between 0 and maxScroll
      const clampedScroll = Math.max(0, Math.min(idealScrollTop, maxScroll));

      // Set scroll position without animation
      scrollContainer.scrollTop = clampedScroll;
    }
  };

  const selectRandomRecipe = () => {
    const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
    setSelectedRecipe(filteredRecipes[randomIndex].id);

    // Use requestAnimationFrame to ensure the DOM has updated
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToSelectedRecipe();
      });
    });
  };

  const handleTagChange = (tag: string, forceDisabled: boolean = false) => {
    if (forceDisabled) {
      setTagFilters((prev) => {
        const next = { ...prev };
        delete next[tag];
        return next;
      });
      return;
    }

    setTagFilters((prev) => {
      const next = { ...prev };
      const currentState = prev[tag] || "disabled";

      if (currentState === "disabled") next[tag] = "whitelist";
      else if (currentState === "whitelist") next[tag] = "blacklist";
      else delete next[tag]; // Reset to disabled state

      return next;
    });
  };

  return (
    <main className="h-screen flex flex-col bg-background">
      <div className="max-w-3xl w-full mx-auto flex flex-col h-full">
        <RecipeFilters
          className="filters-container backdrop-blur-sm bg-card/80 border-card-border flex-shrink-0"
          allTags={Array.from(new Set(recipes.flatMap((r) => r.tags))).sort()}
          tagFilters={tagFilters}
          effortRange={effortRange}
          onTagChange={handleTagChange}
          onEffortRangeChange={setEffortRange}
          onClearFilters={clearFilters}
          showClearFilters={
            Object.keys(tagFilters).length > 0 ||
            effortRange[0] !== 1 ||
            effortRange[1] !== 5
          }
        />

        <div className="flex-1 p-4 overflow-y-auto recipe-scroll-container">
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

        <div className="p-4 bg-gradient-to-t from-background to-background/80 backdrop-blur-sm flex-shrink-0">
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

"use client";

import { useState, useMemo } from "react";
import { recipes } from "@/data/recipes";
import { RecipeFilters } from "@/components/RecipeFilters";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useClientState } from "@/hooks/useClientState";
import { RecipeShow } from "@/components/RecipeShow";
import { RecipeListItem } from "@/components/RecipeListItem";

type TagFilterState = "disabled" | "whitelist" | "blacklist";
type TagFilters = Record<string, TagFilterState>;

export default function Home() {
  const [currentRecipeId, setCurrentRecipeId] = useState<string | null>(null);
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

  const recipeNavigation = useMemo(() => {
    if (!currentRecipeId) return null;
    
    const currentIndex = filteredRecipes.findIndex(r => r.id === currentRecipeId);
    return {
      hasPrevious: filteredRecipes.length > 0,
      hasNext: filteredRecipes.length > 0,
      previousId: filteredRecipes.length > 0 
        ? currentIndex <= 0 
          ? filteredRecipes[filteredRecipes.length - 1].id
          : filteredRecipes[currentIndex - 1].id
        : null,
      nextId: filteredRecipes.length > 0
        ? currentIndex >= filteredRecipes.length - 1
          ? filteredRecipes[0].id
          : filteredRecipes[currentIndex + 1].id
        : null,
      isCurrentRecipeFiltered: currentIndex !== -1
    };
  }, [currentRecipeId, filteredRecipes]);

  const selectRandomRecipe = () => {
    if (filteredRecipes.length === 0) return;

    let randomIndex: number;
    if (filteredRecipes.length === 1) {
      randomIndex = 0;
    } else {
      do {
        randomIndex = Math.floor(Math.random() * filteredRecipes.length);
      } while (filteredRecipes[randomIndex].id === currentRecipeId);
    }

    setCurrentRecipeId(filteredRecipes[randomIndex].id);
  };

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

  const currentRecipe = currentRecipeId ? recipes.find(r => r.id === currentRecipeId) : null;

  return (
    <main className="h-dvh flex flex-col bg-background">
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
          {currentRecipe ? (
            <RecipeShow
              recipe={currentRecipe}
              isFiltered={recipeNavigation?.isCurrentRecipeFiltered ?? false}
              onBack={() => setCurrentRecipeId(null)}
              tagFilters={tagFilters}
              onTagChange={(tag) => {
                handleTagChange(tag);
                // Note: we're not passing forceDisabled here since we want the cycling behavior
              }}
            />
          ) : (
            <div className="space-y-3">
              {filteredRecipes.map((recipe) => (
                <RecipeListItem
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setCurrentRecipeId(recipe.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-gradient-to-t from-background to-background/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex gap-2">
            {currentRecipe && (
              <button
                onClick={() => recipeNavigation?.previousId && setCurrentRecipeId(recipeNavigation.previousId)}
                disabled={!recipeNavigation?.hasPrevious}
                className="px-4 py-3 rounded-xl font-medium bg-gray-100 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={selectRandomRecipe}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm"
            >
              Pick Random Recipe
            </button>

            {currentRecipe && (
              <button
                onClick={() => recipeNavigation?.nextId && setCurrentRecipeId(recipeNavigation.nextId)}
                disabled={!recipeNavigation?.hasNext}
                className="px-4 py-3 rounded-xl font-medium bg-gray-100 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";
import { useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FireIcon } from "@heroicons/react/24/solid";

interface FilterProps {
  className?: string;
  allTags: string[];
  selectedTags: string[];
  effortRange: [number, number];
  onTagChange: (tag: string) => void;
  onEffortRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
  showClearFilters: boolean;
}

export function RecipeFilters({
  className,
  allTags,
  selectedTags,
  effortRange,
  onTagChange,
  onEffortRangeChange,
  onClearFilters,
  showClearFilters,
}: FilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Add this function to handle scrolling
  const ensureVisibleRecipe = () => {
    // Give the DOM time to update
    setTimeout(() => {
      const selectedRecipe = document.querySelector('[data-selected="true"]');
      if (selectedRecipe) {
        selectedRecipe.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  return (
    <div
      className={`bg-white border-b sticky top-0 z-10 shadow-sm ${
        className || ""
      }`}
    >
      {isExpanded ? (
        // Expanded View (existing filters layout)
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Filters</h2>
            <div className="flex gap-2">
              {showClearFilters && (
                <button
                  onClick={() => {
                    onClearFilters();
                    ensureVisibleRecipe();
                  }}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            {/* Effort Range Slider */}
            <div className="space-y-2 w-full">
              <div className="flex justify-between">
                <h3 className="text-sm font-semibold">Effort Level</h3>
                <span className="text-sm text-gray-500">
                  {effortRange[0]} - {effortRange[1]}
                </span>
              </div>
              <div className="relative pt-2 px-4">
                <div className="relative h-3">
                  {/* Background track */}
                  <div className="absolute h-3 w-full bg-gray-200 rounded-full"></div>

                  {/* Selected range */}
                  <div
                    className="absolute h-3 bg-blue-500 rounded-full"
                    style={{
                      left: `${((effortRange[0] - 1) / 4) * 100}%`,
                      right: `${100 - ((effortRange[1] - 1) / 4) * 100}%`,
                    }}
                  ></div>

                  {/* Scale markers */}
                  <div className="absolute w-full h-full flex justify-between items-center px-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="w-0.5 h-5 bg-gray-300 -mt-1" />
                    ))}
                  </div>

                  {/* Min handle */}
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={effortRange[0]}
                    onChange={(e) => {
                      const newMin = Math.min(
                        Number(e.target.value),
                        effortRange[1]
                      );
                      onEffortRangeChange([newMin, effortRange[1]]);
                      ensureVisibleRecipe();
                    }}
                    className="absolute w-full -top-2.5 h-8 appearance-none bg-transparent pointer-events-none 
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto 
                      [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
                      [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:hover:bg-blue-600
                      [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto 
                      [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:rounded-full 
                      [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white
                      [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:hover:bg-blue-600"
                  />

                  {/* Max handle */}
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={effortRange[1]}
                    onChange={(e) => {
                      const newMax = Math.max(
                        Number(e.target.value),
                        effortRange[0]
                      );
                      onEffortRangeChange([effortRange[0], newMax]);
                      ensureVisibleRecipe();
                    }}
                    className="absolute w-full -top-2.5 h-8 appearance-none bg-transparent pointer-events-none 
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto 
                      [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
                      [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:hover:bg-blue-600
                      [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto 
                      [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:rounded-full 
                      [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white
                      [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:hover:bg-blue-600"
                  />
                </div>

                {/* Scale labels */}
                <div className="relative w-full flex justify-between mt-2 px-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span key={num} className="text-xs text-gray-500">
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags Section - now always expanded */}
            <div className="space-y-2 w-full">
              <h3 className="text-sm font-semibold">
                Ingredients{" "}
                {selectedTags.length > 0 && `(${selectedTags.length})`}
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      onTagChange(tag);
                      ensureVisibleRecipe();
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Collapsed Summary View
        <div className="p-2 flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
          </button>

          <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Effort Level Indicator */}
            {(effortRange[0] !== 1 || effortRange[1] !== 5) && (
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                <FireIcon className="w-4 h-4" />
                <span className="text-xs">
                  {effortRange[0]}-{effortRange[1]}
                </span>
              </div>
            )}

            {/* Selected Tags */}
            {selectedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  onTagChange(tag);
                  ensureVisibleRecipe();
                }}
                className="px-2 py-1 rounded-full text-xs bg-blue-500 text-white whitespace-nowrap"
              >
                {tag}
              </button>
            ))}
          </div>

          {showClearFilters && (
            <button
              onClick={() => {
                onClearFilters();
                ensureVisibleRecipe();
              }}
              className="p-1.5 hover:bg-gray-100 rounded-md"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

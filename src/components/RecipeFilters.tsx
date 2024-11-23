"use client";
import { useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { FireIcon } from "@heroicons/react/24/solid";

interface FilterProps {
  className?: string;
  allTags: string[];
  tagFilters: Record<string, "disabled" | "whitelist" | "blacklist">;
  effortRange: [number, number];
  onTagChange: (tag: string, forceDisabled?: boolean) => void;
  onEffortRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
  showClearFilters: boolean;
}

export function RecipeFilters({
  className,
  allTags,
  tagFilters,
  effortRange,
  onTagChange,
  onEffortRangeChange,
  onClearFilters,
  showClearFilters,
}: FilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const ensureVisibleRecipe = () => {
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

  const getTagClassName = (tag: string) => {
    const state = tagFilters[tag] || "disabled";
    
    if (state === "disabled") {
      return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
    if (state === "whitelist") {
      return "bg-blue-500 text-white border-blue-600";
    }
    if (state === "blacklist") {
      return "bg-white text-red-600 border-red-300 line-through hover:bg-red-50";
    }
    return "";
  };

  const hasActiveFilters =
    Object.keys(tagFilters).length > 0 || effortRange[0] !== 1 || effortRange[1] !== 5;

  return (
    <div
      className={`bg-white border-b sticky top-0 z-10 shadow-sm ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between p-2 border-b min-h-[52px]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-md"
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium">Filters</span>
          {isExpanded ? (
            <ChevronUpIcon className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          )}
        </button>

        <div className="h-9">
          {showClearFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearFilters();
                ensureVisibleRecipe();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm 
                text-red-600 hover:text-red-700
                border border-red-200 hover:border-red-300
                hover:bg-red-50
                rounded-md transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {isExpanded ? (
        <div className="p-4 border-t">
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

                  {/* Colored segments */}
                  {[1, 2, 3, 4].map((segment) => {
                    const isInRange =
                      segment >= effortRange[0] && segment < effortRange[1];
                    if (!isInRange) return null;

                    const segmentColor =
                      segment === 1
                        ? "bg-green-500"
                        : segment === 2
                        ? "bg-yellow-500"
                        : segment === 3
                        ? "bg-orange-500"
                        : "bg-red-500";

                    const leftPosition = `${((segment - 1) / 4) * 100}%`;
                    const rightPosition = `${(1 - segment / 4) * 100}%`;

                    return (
                      <div
                        key={segment}
                        className={`absolute h-3 ${segmentColor}`}
                        style={{
                          left: leftPosition,
                          right: rightPosition,
                        }}
                      />
                    );
                  })}

                  {/* Final segment (if range includes 5) */}
                  {effortRange[1] === 5 && effortRange[0] <= 4 && (
                    <div
                      className="absolute h-3 bg-red-500"
                      style={{
                        left: `${
                          ((Math.max(4, effortRange[0]) - 1) / 4) * 100
                        }%`,
                        right: "0%",
                      }}
                    />
                  )}

                  {/* Scale markers */}
                  <div className="absolute w-full h-full flex justify-between items-center px-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="w-0.5 h-5 -mt-1 bg-gray-300" />
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

            {/* Tags Section */}
            <div className="space-y-2 w-full">
              <h3 className="text-sm font-semibold">
                Ingredients{" "}
                {Object.keys(tagFilters).length > 0 && `(${Object.keys(tagFilters).length})`}
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      onTagChange(tag);
                      ensureVisibleRecipe();
                    }}
                    className={`px-3 py-1 text-sm rounded-full border ${getTagClassName(tag)}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : hasActiveFilters ? (
        <div className="px-2 py-1.5 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Effort Level Indicator */}
            {(effortRange[0] !== 1 || effortRange[1] !== 5) && (
              <button
                onClick={() => {
                  onEffortRangeChange([1, 5]);
                  ensureVisibleRecipe();
                }}
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
              >
                <FireIcon className="w-4 h-4 text-gray-700" />
                <span className="text-sm text-gray-700">
                  {effortRange[0]}-{effortRange[1]}
                </span>
              </button>
            )}

            {/* Selected Tags */}
            {Object.entries(tagFilters).map(([tag, state]) => (
              <button
                key={tag}
                onClick={() => {
                  onTagChange(tag, true);
                  ensureVisibleRecipe();
                }}
                className={`px-3 py-1 text-sm rounded-full border whitespace-nowrap hover:opacity-90 transition-colors ${
                  state === "whitelist"
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-white text-red-600 border-red-300 line-through"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

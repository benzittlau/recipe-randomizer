'use client';

interface FilterProps {
  allTags: string[];
  selectedTags: string[];
  effortRange: [number, number];
  onTagChange: (tag: string) => void;
  onEffortRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

export function RecipeFilters({
  allTags,
  selectedTags,
  effortRange,
  onTagChange,
  onEffortRangeChange,
  onClearFilters
}: FilterProps) {
  const hasActiveFilters = selectedTags.length > 0 || 
    (effortRange[0] > 1 || effortRange[1] < 5);

  return (
    <div className="bg-white border-b p-4 sticky top-0 z-10 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Clear all filters
          </button>
        )}
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
                  right: `${100 - ((effortRange[1] - 1) / 4) * 100}%`
                }}
              ></div>

              {/* Scale markers */}
              <div className="absolute w-full h-full flex justify-between items-center px-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div 
                    key={num} 
                    className="w-0.5 h-5 bg-gray-300 -mt-1"
                  />
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
                  const newMin = Math.min(Number(e.target.value), effortRange[1]);
                  onEffortRangeChange([newMin, effortRange[1]]);
                }}
                className="absolute w-full -top-2.5 h-8 appearance-none bg-transparent pointer-events-none 
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto 
                  [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-gray-50 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-blue-600
                  [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:hover:border-blue-700 [&::-webkit-slider-thumb]:hover:bg-white
                  [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto 
                  [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-gray-50 [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-blue-600
                  [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:hover:border-blue-700 [&::-moz-range-thumb]:hover:bg-white"
              />
              
              {/* Max handle */}
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={effortRange[1]}
                onChange={(e) => {
                  const newMax = Math.max(Number(e.target.value), effortRange[0]);
                  onEffortRangeChange([effortRange[0], newMax]);
                }}
                className="absolute w-full -top-2.5 h-8 appearance-none bg-transparent pointer-events-none 
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto 
                  [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-gray-50 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-blue-600
                  [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:hover:border-blue-700 [&::-webkit-slider-thumb]:hover:bg-white
                  [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto 
                  [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-gray-50 [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-blue-600
                  [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:hover:border-blue-700 [&::-moz-range-thumb]:hover:bg-white"
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

        {/* Tags */}
        <div className="space-y-2 w-full">
          <h3 className="text-sm font-semibold">Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagChange(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
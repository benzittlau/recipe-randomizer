export function generateRecipeDescription(recipe: Recipe): string {
  const effortDescriptions = {
    1: "quick and simple",
    2: "easy to prepare",
    3: "moderately involved",
    4: "more elaborate",
    5: "complex and time-intensive",
  };

  const tagDescriptions = recipe.tags.length > 0
    ? recipe.tags
        .map((tag) => {
          // Convert tags to more natural language
          switch (tag) {
            case "instapot": return "made in the Instant Pot";
            case "breakfast": return "perfect for breakfast";
            default: return `featuring ${tag}`;
          }
        })
        .slice(0, 2)
        .join(" and ")
    : "";

  const baseDescription = `A ${effortDescriptions[recipe.effort as 1 | 2 | 3 | 4 | 5]} dish`;
  
  return tagDescriptions
    ? `${baseDescription} ${tagDescriptions}.`
    : `${baseDescription}.`;
} 
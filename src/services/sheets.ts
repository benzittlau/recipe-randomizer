const SHEET_ID = "1iIthh7N1L_fepFzx5RVWUSnTs8VCqd_Kz12lJPRx07g";
const SHEET_NAME = "Recipes To Choose From";

import { generateRecipeDescription } from "@/utils/recipeDescription";

interface SheetCell {
  v: string | number | null;
  f?: string;
}

interface SheetRow {
  c: Array<SheetCell | null>;
}

export async function fetchRecipes() {
  try {
    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
        SHEET_NAME
      )}`
    );

    const text = await response.text();
    // Remove the google.visualization.Query.setResponse() wrapper
    const jsonString = text.substring(47, text.length - 2);
    const data = JSON.parse(jsonString);

    // Transform the data into our Recipe format
    const recipes = data.table.rows
      .filter((row: SheetRow) => row.c[0]?.v) // Filter out empty rows
      .map((row: SheetRow, index: number) => {
        // Collect tags from all columns starting from index 2 (column C) onwards
        const allTags = row.c
          .slice(2) // Start from column C (index 2)
          .filter((cell) => cell?.v) // Filter out empty cells
          .filter((cell) => cell !== null) // Filter out empty cells
          .map((cell) => `${cell.v}`) // Convert to string
          .flatMap(
            (
              value // Split any comma-separated values
            ) =>
              value
                .split(",")
                .map((tag: string) => tag.trim())
                .filter(Boolean)
          );

        return {
          id: String(index + 1),
          name: row.c[0]?.v || "",
          effort: parseInt(`${row.c[1]?.v ?? "1"}`) || 1,
          tags: allTags,
          description: "", // We'll generate this after
        };
      });

    // Add descriptions to all recipes
    recipes.forEach(recipe => {
      recipe.description = generateRecipeDescription(recipe);
    });

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

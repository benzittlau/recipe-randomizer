export interface Recipe {
  id: string;
  name: string;
  description?: string;
  effort: number;
  tags: string[];
}

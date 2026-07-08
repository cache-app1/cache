export const CATEGORIES = [
  "recipe",
  "outfit",
  "travel",
  "quote",
  "listing",
  "meme",
  "social",
  "receipt",
  "other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<Category, string> = {
  recipe: "bg-orange-200/30 text-orange-700",
  outfit: "bg-blue-200/30 text-blue-700",
  travel: "bg-pink-200/30 text-pink-700",
  quote: "bg-purple-200/30 text-purple-700",
  listing: "bg-green-200/30 text-green-700",
  meme: "bg-yellow-200/30 text-yellow-700",
  social: "bg-indigo-200/30 text-indigo-700",
  receipt: "bg-teal-200/30 text-teal-700",
  other: "bg-gray-200/30 text-gray-700",
};

export function normalizeCategory(
  value: string | null | undefined
): Category {
  const normalized = value?.trim().toLowerCase();
  return (CATEGORIES as readonly string[]).includes(normalized ?? "")
    ? (normalized as Category)
    : "other";
}

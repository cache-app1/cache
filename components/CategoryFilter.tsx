"use client";

export function CategoryFilter({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
}) {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 flex flex-wrap gap-2.5">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          selected === null
            ? "bg-indigo-600 text-white shadow-sm"
            : "border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
        }`}
      >
        All
      </button>
      {options.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag)}
          className={`rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors ${
            selected === tag
              ? "bg-indigo-600 text-white shadow-sm"
              : "border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
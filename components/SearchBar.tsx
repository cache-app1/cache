"use client";

import { useState, type FormEvent } from "react";

export function SearchBar({
  onSearch,
  onClear,
}: {
  onSearch: (query: string) => Promise<void>;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [active, setActive] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    await onSearch(query.trim());
    setSearching(false);
    setActive(true);
  }

  function handleClear() {
    setQuery("");
    setActive(false);
    onClear();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex flex-wrap gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your screenshots..."
        className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-5 py-3.5 text-base text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
      />
      <button
        type="submit"
        disabled={searching}
        className="rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-50"
      >
        {searching ? "Searching..." : "Search"}
      </button>
      {active && (
        <button
          type="button"
          onClick={handleClear}
          className="rounded-xl border border-zinc-200 px-5 py-3.5 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
        >
          Clear
        </button>
      )}
    </form>
  );
}
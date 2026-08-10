"use client";

import { useMemo, useState } from "react";
import type { Artwork, ArtworkFilterOptions } from "@/lib/artworks";
import { ArtworkCard } from "@/components/cards/artwork-card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

type FilterKey = "artist" | "medium" | "country" | "size" | "type";

const FILTER_LABELS: Record<FilterKey, string> = {
  artist: "Artist",
  medium: "Medium",
  country: "Country",
  size: "Size",
  type: "Type",
};

const FILTER_OPTION_KEYS: Record<FilterKey, keyof ArtworkFilterOptions> = {
  artist: "artists",
  medium: "mediums",
  country: "countries",
  size: "sizes",
  type: "types",
};

export function ArtworksExplorer({
  artworks,
  filterOptions,
}: {
  artworks: Artwork[];
  filterOptions: ArtworkFilterOptions;
}) {
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    artist: "",
    medium: "",
    country: "",
    size: "",
    type: "",
  });

  const filtered = useMemo(() => {
    return artworks.filter((artwork) => {
      if (filters.artist && artwork.artist !== filters.artist) return false;
      if (filters.medium && artwork.medium !== filters.medium) return false;
      if (filters.country && artwork.country !== filters.country) return false;
      if (filters.size && artwork.size !== filters.size) return false;
      if (filters.type && artwork.type !== filters.type) return false;
      return true;
    });
  }, [artworks, filters]);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div>
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-mist pb-8">
        <div className="flex flex-wrap gap-6">
          {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => (
            <label key={key} className="flex flex-col gap-2">
              <span className="eyebrow">{FILTER_LABELS[key]}</span>
              <select
                value={filters[key]}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className={cn(
                  "min-w-[10rem] border-0 border-b border-mist bg-transparent pb-1 font-sans text-sm font-light text-ink",
                  "focus:border-ink focus:outline-none"
                )}
              >
                <option value="">All</option>
                {filterOptions[FILTER_OPTION_KEYS[key]].map(
                  (value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  )
                )}
              </select>
            </label>
          ))}
        </div>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={() =>
              setFilters({ artist: "", medium: "", country: "", size: "", type: "" })
            }
            className="font-sans text-xs font-light uppercase tracking-widest text-ink/70 hover:text-ink"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <p className="mb-8 font-sans text-xs font-light uppercase tracking-widest text-stone">
        {filtered.length} work{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((artwork) => (
            <ArtworkCard key={artwork.slug} artwork={artwork} />
          ))}
        </div>
      ) : (
        <EmptyState>No works match these filters.</EmptyState>
      )}
    </div>
  );
}

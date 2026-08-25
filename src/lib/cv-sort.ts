// CV sections come out of Sanity in whatever order they were entered, which is
// rarely chronological. These helpers sort them newest-first for display.
//
// Most CV fields are plain strings with the year written into the front of the
// line ("2016 — Marmite Prize, London, UK", "2021–2025 — BA Fine Art, …"), so
// the year has to be parsed back out rather than read from a field.

const ONGOING = 9999;

/**
 * Pulls a sortable year off the front of a CV line.
 *
 * For a range the END year is used, so an ongoing entry ("2021–present")
 * outranks a finished one that started later. Lines with no leading year sort
 * last rather than jumping to the top.
 */
export function cvYear(value: string | undefined | null): number {
  if (!value) return -Infinity;
  const text = value.trim();

  // "2021–2025 — …", "2021-2025", "2021 – present", "2021—ongoing"
  const range = text.match(/^(\d{4})\s*[–—-]\s*(\d{4}|present|current|ongoing)\b/i);
  if (range) {
    const end = range[2];
    return /^\d{4}$/.test(end) ? Number(end) : ONGOING;
  }

  const single = text.match(/^(\d{4})\b/);
  if (single) return Number(single[1]);

  return -Infinity;
}

/** Sorts CV lines ("2016 — …") newest-first, leaving undated lines at the end. */
export function sortCvLines<T extends string>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => cvYear(b) - cvYear(a));
}

/** Sorts exhibition-style entries newest-first using their `year` field. */
export function sortByYearField<T extends { year?: string }>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => cvYear(b.year) - cvYear(a.year));
}

/** Sorts press entries newest-first, leaving undated entries at the end. */
export function sortByDateField<T extends { date?: string }>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });
}

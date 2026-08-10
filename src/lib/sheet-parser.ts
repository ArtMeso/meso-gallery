/**
 * Minimal RFC4180-style delimited-text parser. Google Sheets' TSV export
 * quotes any cell containing a tab, quote, or newline and doubles internal
 * quotes — the same escaping CSV uses, just with \t as the delimiter — so a
 * naive `line.split("\t")` breaks on multi-line Bio cells. This parses
 * character-by-character instead of line-by-line for that reason.
 */
export function parseDelimited(text: string, delimiter = "\t"): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\r") {
      // skip; \r\n handled by the following \n
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

export function rowsToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length === 0) return [];
  const [header, ...body] = rows;
  const keys = header.map((h) => h.trim());
  return body.map((r) => {
    const obj: Record<string, string> = {};
    keys.forEach((key, i) => {
      obj[key] = (r[i] ?? "").trim();
    });
    return obj;
  });
}

// Reads the header at the top of a generator file (see CONTRIBUTING.md): who wrote it, whether AI
// helped, and each recorded teacher review. No imports, so the gallery's build can use it too.

export interface Review {
  /** YYYY-MM-DD. */
  date: string;
  reviewer: string;
  /** What was reviewed, e.g. "(teacher): depth 4 checked in the gallery, all numbers settings". */
  note: string;
}

export interface GeneratorHeader {
  statement?: string;
  author?: string;
  /** "no", or "yes: …" with what the tool did. */
  aiAssisted?: string;
  reviews: Review[];
}

export function parseHeader(source: string): GeneratorHeader {
  const block = /^\s*\/\*\*([\s\S]*?)\*\//.exec(source)?.[1] ?? "";
  const tags = [...block.matchAll(/^\s*\*?\s*@(\w[\w-]*)\s+(.*)$/gm)].map(
    (m) => [m[1] ?? "", (m[2] ?? "").trim()] as const,
  );
  const header: GeneratorHeader = { reviews: [] };
  for (const [tag, value] of tags) {
    if (tag === "statement") header.statement = value;
    else if (tag === "author") header.author = value;
    else if (tag === "ai-assisted") header.aiAssisted = value;
    else if (tag === "reviewed") {
      const m = /^(\d{4}-\d{2}-\d{2})\s+(@[\w-]+)\s*(.*)$/.exec(value);
      if (m) header.reviews.push({ date: m[1] ?? "", reviewer: m[2] ?? "", note: m[3] ?? "" });
    }
  }
  return header;
}

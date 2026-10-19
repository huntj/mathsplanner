// A small reader for the pipe tables in the progression map. It only understands what the
// map uses: ATX headings (## and ###) and GitHub-style pipe tables.

export interface TableRow {
  /** 1-based line number in the source file. */
  line: number;
  cells: string[];
}

export interface MarkdownTable {
  /** 1-based line number of the header row. */
  line: number;
  h2: string | undefined;
  h3: string | undefined;
  header: string[];
  rows: TableRow[];
}

const DELIMITER_ROW = /^\|(\s*:?-+:?\s*\|)+\s*$/;

/** Splits a table row into trimmed cells, honouring `\|` escapes and unescaping punctuation. */
export function splitRow(line: string): string[] {
  let body = line.trim();
  if (body.startsWith("|")) body = body.slice(1);
  if (body.endsWith("|") && !body.endsWith("\\|")) body = body.slice(0, -1);

  const cells: string[] = [];
  let current = "";
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === "\\" && i + 1 < body.length && /[!-/:-@[-`{-~]/.test(body[i + 1] ?? "")) {
      current += body[i + 1];
      i++;
    } else if (ch === "|") {
      cells.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

export function parseTables(markdown: string): MarkdownTable[] {
  const lines = markdown.split(/\r?\n/);
  const tables: MarkdownTable[] = [];
  let h2: string | undefined;
  let h3: string | undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const heading = /^(#{2,3})\s+(.*?)\s*#*\s*$/.exec(line);
    if (heading) {
      if (heading[1] === "##") {
        h2 = heading[2];
        h3 = undefined;
      } else {
        h3 = heading[2];
      }
      continue;
    }

    if (line.startsWith("|") && DELIMITER_ROW.test(lines[i + 1] ?? "")) {
      const table: MarkdownTable = { line: i + 1, h2, h3, header: splitRow(line), rows: [] };
      let j = i + 2;
      while (j < lines.length && (lines[j] ?? "").startsWith("|")) {
        table.rows.push({ line: j + 1, cells: splitRow(lines[j] ?? "") });
        j++;
      }
      tables.push(table);
      i = j - 1;
    }
  }
  return tables;
}

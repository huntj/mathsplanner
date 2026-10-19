import {
  parseId,
  STAGE_SOURCE,
  type KS5Year,
  type Stage,
  type Statement,
} from "@mathsplanner/core";
import { parseTables, type MarkdownTable } from "./markdown.ts";
import { isStatutory, OPTION_NAMES } from "./rules.ts";

export interface ImportIssue {
  line: number;
  id?: string;
  message: string;
}

export interface ImportResult {
  statements: Statement[];
  /** Problems that stop the import. */
  errors: ImportIssue[];
  /** Things the import noticed but did not change; they belong in docs/data-report.md. */
  notes: ImportIssue[];
}

const COLUMN = { id: "ID", text: "I can…", needs: "Needs", year: "Yr", option: "Option" };

function isStatementTable(table: MarkdownTable): boolean {
  return table.header.includes(COLUMN.id) && table.header.includes(COLUMN.text);
}

/**
 * The stages a section of the map may contain, and the source named in that section.
 * Returns undefined for a section that should not hold statements.
 */
export function sectionInfo(
  h2: string | undefined,
  h3: string | undefined,
): { stages: Stage[]; source: string } | undefined {
  if (h2 === undefined) return undefined;
  if (h2.includes("1MA1")) return { stages: ["GF", "GH"], source: STAGE_SOURCE.GF };
  if (h2.includes("9MA0")) return { stages: ["AL"], source: STAGE_SOURCE.AL };
  if (h2.includes("9FM0")) return { stages: ["FM"], source: STAGE_SOURCE.FM };
  if (h2.includes("7MC0")) return { stages: ["CM"], source: STAGE_SOURCE.CM };
  if (h2.startsWith("EYFS")) {
    if (h3?.startsWith("Nursery")) return { stages: ["N"], source: STAGE_SOURCE.N };
    if (h3?.startsWith("Reception")) return { stages: ["R"], source: STAGE_SOURCE.R };
    return undefined;
  }
  const year = /^Year ([1-9])\b/.exec(h3 ?? "");
  if (/Key Stage [123]\b/.test(h2) && year) {
    const stage = `Y${year[1]}` as Stage;
    return { stages: [stage], source: STAGE_SOURCE[stage] };
  }
  return undefined;
}

function parseYears(cell: string): KS5Year[] | undefined {
  const parts = cell.split(",").map((p) => p.trim());
  if (parts.length === 0 || parts.some((p) => p !== "12" && p !== "13")) return undefined;
  return [...new Set(parts.map((p) => Number(p) as KS5Year))].sort();
}

/** Parses every statement table in the progression map into Statement objects, in map order. */
export function importMap(markdown: string): ImportResult {
  const statements: Statement[] = [];
  const errors: ImportIssue[] = [];
  const notes: ImportIssue[] = [];

  for (const table of parseTables(markdown).filter(isStatementTable)) {
    const col = (name: string) => table.header.indexOf(name);
    const idCol = col(COLUMN.id);
    const textCol = col(COLUMN.text);
    const needsCol = col(COLUMN.needs);
    const yearCol = col(COLUMN.year);
    const optionCol = col(COLUMN.option);
    const section = sectionInfo(table.h2, table.h3);

    if (needsCol < 0) {
      errors.push({ line: table.line, message: "statement table has no Needs column" });
      continue;
    }
    if (!section) {
      errors.push({
        line: table.line,
        message: `statement table in an unrecognised section: "${table.h2 ?? ""} / ${table.h3 ?? ""}"`,
      });
      continue;
    }

    const stagesHere = new Set<Stage>();
    for (const row of table.rows) {
      const cell = (i: number) => (i >= 0 ? (row.cells[i] ?? "") : "");
      const issue = (message: string, id?: string) =>
        errors.push({ line: row.line, ...(id ? { id } : {}), message });

      if (row.cells.length !== table.header.length) {
        issue(`row has ${row.cells.length} cells but the header has ${table.header.length}`);
        continue;
      }

      const id = cell(idCol);
      const parsed = parseId(id);
      if (!parsed) {
        issue(`"${id}" does not follow the ID scheme`, id);
        continue;
      }
      stagesHere.add(parsed.stage);
      if (!section.stages.includes(parsed.stage)) {
        issue(`stage ${parsed.stage} does not belong in section "${table.h3 ?? table.h2}"`, id);
      }

      const text = cell(textCol);
      if (!text) issue("empty I can… text", id);

      const needs = cell(needsCol)
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
      for (const need of needs) {
        if (!parseId(need)) issue(`Needs entry "${need}" does not follow the ID scheme`, id);
      }

      const statement: Statement = {
        id,
        stage: parsed.stage,
        strand: parsed.strand,
        text,
        needs,
        source: section.source,
        statutory: isStatutory(parsed.stage, text),
      };

      if (yearCol >= 0) {
        const years = parseYears(cell(yearCol));
        if (years) statement.years = years;
        else issue(`Yr "${cell(yearCol)}" is not 12, 13 or "12, 13"`, id);
      }

      if (parsed.tier) statement.tier = parsed.tier;

      if (optionCol >= 0) {
        const name = cell(optionCol);
        const option = OPTION_NAMES[name];
        if (!option) issue(`unknown option "${name}"`, id);
        else if (option !== parsed.option) {
          issue(`Option column says ${option} but the ID says ${parsed.option ?? "core pure"}`, id);
        } else statement.option = option;
      } else if (parsed.option) {
        issue(`ID names option ${parsed.option} but the table has no Option column`, id);
      }

      // Keep the order of the Statement interface so the JSON reads the same everywhere.
      statements.push({
        id: statement.id,
        stage: statement.stage,
        strand: statement.strand,
        text: statement.text,
        needs: statement.needs,
        ...(statement.years ? { years: statement.years } : {}),
        ...(statement.tier ? { tier: statement.tier } : {}),
        ...(statement.option ? { option: statement.option } : {}),
        source: statement.source,
        statutory: statement.statutory,
      });
    }

    if (yearCol < 0 && [...stagesHere].some((s) => s === "AL" || s === "FM" || s === "CM")) {
      notes.push({
        line: table.line,
        message: `KS5 table "${table.h3 ?? table.h2}" has no Yr column, so its ${table.rows.length} statements have no recommended year`,
      });
    }
  }

  return { statements, errors, notes };
}

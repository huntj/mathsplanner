// pnpm data:import: parses docs/progression-map.md into data/statements.json, then checks it.
// Once statements are edited by pull request, the JSON is the source of truth: re-running
// this overwrites those edits, so only do it deliberately.
import { writeFileSync } from "node:fs";
import { relative } from "node:path";
import type { StatementsFile } from "@mathsplanner/core";
import { format, resolveConfig } from "prettier";
import { checkData } from "./check.ts";
import { printCheck } from "./check-cli.ts";
import { loadCheckInput, PATHS, readText, ROOT } from "./files.ts";
import { importMap } from "./import.ts";

export const STATEMENTS_VERSION = "0.1.0";

const result = importMap(readText(PATHS.map));
const where = (line: number, id?: string) =>
  `${relative(ROOT, PATHS.map)}:${line}${id ? ` ${id}` : ""}`;

for (const note of result.notes) console.log(`note: ${where(note.line, note.id)}: ${note.message}`);

if (result.errors.length > 0) {
  for (const e of result.errors) console.error(`error: ${where(e.line, e.id)}: ${e.message}`);
  console.error(`\n${result.errors.length} error(s); data/statements.json was not written.`);
  process.exit(1);
}

const file: StatementsFile = {
  $schema: "./schema/statements.schema.json",
  version: STATEMENTS_VERSION,
  statements: result.statements,
};
const options = (await resolveConfig(PATHS.statements)) ?? {};
writeFileSync(
  PATHS.statements,
  await format(JSON.stringify(file), { ...options, filepath: PATHS.statements }),
);
console.log(
  `Wrote ${result.statements.length} statements to ${relative(ROOT, PATHS.statements)}.\n`,
);

const { input, summaryErrors } = loadCheckInput();
if (!printCheck(checkData(input), summaryErrors)) process.exitCode = 1;

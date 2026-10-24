// pnpm data:topics: checks data/topics.txt, refills its wording and order, and writes
// data/topics.json.
import { writeFileSync } from "node:fs";
import { relative } from "node:path";
import type { StatementsFile } from "@mathsplanner/core";
import { format, resolveConfig } from "prettier";
import { PATHS, readJson, readText, ROOT } from "./files.ts";
import { buildTopics } from "./topics.ts";

const { statements } = readJson(PATHS.statements) as StatementsFile;
const result = buildTopics(readText(PATHS.topicsText), statements);

if (result.errors.length > 0) {
  for (const e of result.errors) console.error(`error: ${relative(ROOT, PATHS.topicsText)}: ${e}`);
  console.error(`\n${result.errors.length} error(s); nothing was written.`);
  process.exit(1);
}

writeFileSync(PATHS.topicsText, result.text);
const options = (await resolveConfig(PATHS.topics)) ?? {};
writeFileSync(
  PATHS.topics,
  await format(JSON.stringify(result.file), { ...options, filepath: PATHS.topics }),
);
console.log(
  `Wrote ${result.file.topics.length} topics to ${relative(ROOT, PATHS.topics)} and tidied ${relative(ROOT, PATHS.topicsText)}.`,
);

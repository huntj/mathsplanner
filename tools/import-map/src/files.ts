import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { CheckInput } from "./check.ts";
import { readSummary } from "./summary.ts";

export const ROOT = resolve(import.meta.dirname, "../../..");

export const PATHS = {
  map: resolve(ROOT, "docs/progression-map.md"),
  statements: resolve(ROOT, "data/statements.json"),
  misconceptions: resolve(ROOT, "data/misconceptions.json"),
  topics: resolve(ROOT, "data/topics.json"),
  topicsText: resolve(ROOT, "data/topics.txt"),
  statementsSchema: resolve(ROOT, "data/schema/statements.schema.json"),
  misconceptionsSchema: resolve(ROOT, "data/schema/misconceptions.schema.json"),
};

export const readText = (path: string) => readFileSync(path, "utf8");
export const readJson = (path: string): unknown => JSON.parse(readText(path));

/** Loads everything data:check needs from the repository. */
export function loadCheckInput(): { input: CheckInput; summaryErrors: string[] } {
  const summary = readSummary(readText(PATHS.map));
  return {
    input: {
      statements: readJson(PATHS.statements),
      misconceptions: readJson(PATHS.misconceptions),
      statementsSchema: readJson(PATHS.statementsSchema) as object,
      misconceptionsSchema: readJson(PATHS.misconceptionsSchema) as object,
      expectedCounts: summary.counts,
    },
    summaryErrors: summary.errors,
  };
}

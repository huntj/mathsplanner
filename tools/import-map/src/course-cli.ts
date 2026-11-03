// pnpm data:course: checks data/course.txt, refills its wording and writes data/course.json.
// pnpm data:course --draft <stage> "<name>": prints a first draft of a new section to add to it.
import { writeFileSync } from "node:fs";
import { relative } from "node:path";
import { STAGES, type Stage, type StatementsFile, type TopicsFile } from "@mathsplanner/core";
import { format, resolveConfig } from "prettier";
import { buildCourse, draftSection } from "./course.ts";
import { PATHS, readJson, readText, ROOT } from "./files.ts";

const { statements } = readJson(PATHS.statements) as StatementsFile;
const { topics } = readJson(PATHS.topics) as TopicsFile;

const [flag, stage, name] = process.argv.slice(2);
if (flag === "--draft") {
  if (!STAGES.includes(stage as Stage)) {
    console.error(
      `Usage: pnpm data:course --draft <stage> "<name>", stage one of ${STAGES.join(", ")}`,
    );
    process.exit(1);
  }
  process.stdout.write(draftSection(stage as Stage, name ?? stage ?? "", statements, topics));
  process.exit(0);
}

const result = buildCourse(readText(PATHS.courseText), statements, topics);
if (result.errors.length > 0) {
  for (const e of result.errors) console.error(`error: ${relative(ROOT, PATHS.courseText)}: ${e}`);
  console.error(`\n${result.errors.length} error(s); nothing was written.`);
  process.exit(1);
}

writeFileSync(PATHS.courseText, result.text);
const options = (await resolveConfig(PATHS.course)) ?? {};
writeFileSync(
  PATHS.course,
  await format(JSON.stringify(result.file), { ...options, filepath: PATHS.course }),
);
const units = result.file.sections.reduce((n, s) => n + s.units.length, 0);
console.log(
  `Wrote ${result.file.sections.length} section(s) and ${units} units to ${relative(ROOT, PATHS.course)} and tidied ${relative(ROOT, PATHS.courseText)}.`,
);

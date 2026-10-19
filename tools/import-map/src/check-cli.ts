// pnpm data:check: validates data/statements.json and data/misconceptions.json.
import { checkData, type CheckResult } from "./check.ts";
import { loadCheckInput } from "./files.ts";

export function printCheck(result: CheckResult, summaryErrors: string[]): boolean {
  const errors = [...summaryErrors, ...result.errors];

  if (result.counts.length > 0) {
    console.log("Statement counts (actual / map summary):");
    for (const c of result.counts) {
      const mark = c.actual === c.expected ? "ok" : "MISMATCH";
      console.log(
        `  ${c.label.padEnd(26)} ${String(c.actual).padStart(4)} / ${c.expected}  ${mark}`,
      );
    }
    if (result.total) {
      console.log(
        `  ${"Total".padEnd(26)} ${String(result.total.actual).padStart(4)} / ${result.total.expected}`,
      );
    }
  }

  if (result.warnings.length > 0) {
    console.log(`\n${result.warnings.length} warning(s), for review in docs/data-report.md:`);
    for (const w of result.warnings) console.log(`  - ${w}`);
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    return false;
  }
  console.log("\ndata:check passed.");
  return true;
}

if (import.meta.main) {
  const { input, summaryErrors } = loadCheckInput();
  if (!printCheck(checkData(input), summaryErrors)) process.exitCode = 1;
}

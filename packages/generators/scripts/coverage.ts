// pnpm coverage: lists statements without a generator (report only) and fails if any generator
// names a statement ID that is not in data/statements.json.
//
// Until defineGenerator exists (Phase 1) generators are found by reading files rather than
// importing them: each file in src/<key stage>/ is named after its statement ID, and every
// `id: "…"` it contains must be a known ID.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { keyStageFolder, type Statement, type StatementsFile } from "@mathsplanner/core";

export const ROOT = resolve(import.meta.dirname, "../../..");
export const GENERATORS_DIR = resolve(import.meta.dirname, "../src");
export const STATEMENTS_PATH = resolve(ROOT, "data/statements.json");
export const KEY_STAGE_FOLDERS = ["eyfs", "ks1", "ks2", "ks3", "ks4", "ks5"] as const;

export interface GeneratorFile {
  /** Path relative to the generators src folder, with forward slashes. */
  path: string;
  folder: string;
  /** The statement ID the file name claims. */
  fileId: string;
  /** Every `id: "…"` literal in the file. */
  declaredIds: string[];
}

export interface CoverageReport {
  covered: string[];
  missing: Statement[];
  /** Fail the run. */
  errors: string[];
  /** Reported but never fail the run. */
  warnings: string[];
}

export function loadStatements(path = STATEMENTS_PATH): Statement[] {
  return (JSON.parse(readFileSync(path, "utf8")) as StatementsFile).statements;
}

export function findGenerators(dir = GENERATORS_DIR): GeneratorFile[] {
  const files: GeneratorFile[] = [];
  for (const folder of KEY_STAGE_FOLDERS) {
    const folderPath = join(dir, folder);
    if (!existsSync(folderPath)) continue;
    for (const entry of readdirSync(folderPath, { recursive: true, withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".ts") || entry.name.endsWith(".test.ts"))
        continue;
      const full = join(entry.parentPath, entry.name);
      const source = readFileSync(full, "utf8");
      files.push({
        path: relative(dir, full).replaceAll("\\", "/"),
        folder,
        fileId: basename(entry.name, ".ts"),
        declaredIds: [...source.matchAll(/\bid:\s*["']([^"']+)["']/g)].map((m) => m[1] ?? ""),
      });
    }
  }
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

export function coverageReport(
  statements: Statement[],
  generators: GeneratorFile[],
): CoverageReport {
  const byId = new Map(statements.map((s) => [s.id, s]));
  const errors: string[] = [];
  const warnings: string[] = [];
  const covered = new Map<string, string>();

  for (const g of generators) {
    for (const id of new Set([g.fileId, ...g.declaredIds])) {
      if (!byId.has(id)) errors.push(`${g.path}: unknown statement ID ${id}`);
    }
    const statement = byId.get(g.fileId);
    if (!statement) continue;
    if (!g.declaredIds.includes(g.fileId)) {
      warnings.push(`${g.path}: file is named ${g.fileId} but does not declare id: "${g.fileId}"`);
    }
    const expected = keyStageFolder(statement.stage);
    if (g.folder !== expected) warnings.push(`${g.path}: ${g.fileId} belongs in src/${expected}/`);
    const earlier = covered.get(g.fileId);
    if (earlier) warnings.push(`${g.path}: ${g.fileId} already has a generator in ${earlier}`);
    else covered.set(g.fileId, g.path);
  }

  return {
    covered: [...covered.keys()],
    missing: statements.filter((s) => !covered.has(s.id)),
    errors,
    warnings,
  };
}

export function printCoverage(report: CoverageReport, total: number): void {
  console.log(`Generator coverage: ${report.covered.length} of ${total} statements.`);
  if (report.missing.length > 0) {
    console.log(`\n${report.missing.length} statement(s) without a generator:`);
    const byStage = new Map<string, string[]>();
    for (const s of report.missing) byStage.set(s.stage, [...(byStage.get(s.stage) ?? []), s.id]);
    for (const [stage, ids] of byStage) {
      console.log(`  ${stage.padEnd(3)} (${ids.length}): ${ids.join(" ")}`);
    }
  }
  for (const w of report.warnings) console.log(`warning: ${w}`);
  for (const e of report.errors) console.error(`error: ${e}`);
}

if (import.meta.main) {
  const statements = loadStatements();
  const report = coverageReport(statements, findGenerators());
  printCoverage(report, statements.length);
  if (report.errors.length > 0) process.exitCode = 1;
}

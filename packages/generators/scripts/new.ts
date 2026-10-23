// pnpm new <ID>: scaffolds a generator file and its test file from a template. The test runs the
// full quality checks, so it fails until the generator is written and a scaffold cannot be
// merged by accident. The gallery picks the generator up once it is added to src/index.ts.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { generatorFileName, keyStageFolder, type Statement } from "@mathsplanner/core";
import { GENERATORS_DIR, loadStatements, ROOT } from "./coverage.ts";

export function generatorTemplate(statement: Statement): string {
  return `/**
 * @statement ${statement.id}
 * @author @your-github-handle
 * @ai-assisted no
 */
// ${statement.id}: ${statement.text}
import { defineGenerator } from "@mathsplanner/core";
// import * as A from "@mathsplanner/archetypes";

export default defineGenerator({
  id: "${statement.id}",
  version: "0.1.0",
  depths: [1],
  misconceptions: [],

  // Parameters depend only on rng and the numbers setting.
  params(rng, numbers) {
    return { n: rng.int(1, numbers === "friendly" ? 10 : 100) };
  },

  // Build each depth with an archetype, e.g. A.standard({ question, answer: A.number(…) }).
  build() {
    throw new Error("${statement.id}: build is not written yet");
  },

  // Recompute the answer a different way.
  verify: () => false,
});
`;
}

export function testTemplate(statement: Statement): string {
  return `import { NUMBERS } from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import { assertQuality } from "../quality.ts";
import generator from "./${generatorFileName(statement.id)}.ts";

describe("${statement.id}", () => {
  it("passes the quality checks across 500 seeds", () => {
    assertQuality(generator);
  }, 120_000);

  it("keeps fixed seeds unchanged", () => {
    const fixed = generator.depths.flatMap((depth) =>
      NUMBERS.map((numbers) => generator.generate({ depth, numbers, seed: 1 })),
    );
    expect(fixed).toMatchSnapshot();
  });
});
`;
}

/** Writes the two files; returns their paths, or throws if the ID is unknown or files exist. */
export function scaffold(id: string, statements: Statement[], dir = GENERATORS_DIR): string[] {
  const statement = statements.find((s) => s.id === id);
  if (!statement) throw new Error(`${id} is not a statement in data/statements.json.`);
  const folder = join(dir, keyStageFolder(statement.stage));
  const files = [
    [join(folder, `${generatorFileName(id)}.ts`), generatorTemplate(statement)],
    [join(folder, `${generatorFileName(id)}.test.ts`), testTemplate(statement)],
  ] as const;
  for (const [path] of files) {
    if (existsSync(path)) throw new Error(`${relative(ROOT, path)} already exists.`);
  }
  mkdirSync(folder, { recursive: true });
  for (const [path, content] of files) writeFileSync(path, content);
  return files.map(([path]) => path);
}

if (import.meta.main) {
  const id = process.argv[2];
  if (!id) {
    console.error("Usage: pnpm new <statement ID>, e.g. pnpm new Y5-FR-04");
    process.exit(1);
  }
  try {
    const paths = scaffold(id, loadStatements());
    console.log(`Created:\n${paths.map((p) => `  ${relative(ROOT, p)}`).join("\n")}`);
    console.log("\nNext: write params and build, fill in the header, then run pnpm test.");
  } catch (error) {
    console.error((error as Error).message);
    process.exitCode = 1;
  }
}

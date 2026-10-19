// pnpm new <ID>: scaffolds a generator file and its test file from a template. The test fails
// until the generator is written, so a scaffold cannot be merged by accident. Gallery entries
// arrive with the gallery in Phase 2.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { keyStageFolder, type Statement } from "@mathsplanner/core";
import { GENERATORS_DIR, loadStatements, ROOT } from "./coverage.ts";

export function generatorTemplate(statement: Statement): string {
  return `/**
 * @statement ${statement.id}
 * @author @your-github-handle
 * @ai-assisted no
 */
// ${statement.id}: ${statement.text}
import { defineGenerator } from "@mathsplanner/core";

export default defineGenerator({
  id: "${statement.id}",
  version: "0.1.0",
  depths: [1],
  misconceptions: [],

  // Parameters depend only on rng and the numbers setting.
  params(rng, numbers) {
    return { n: rng.int(1, numbers === "friendly" ? 10 : 100) };
  },

  build() {
    throw new Error("${statement.id}: build is not written yet");
  },
});
`;
}

export function testTemplate(statement: Statement): string {
  return `import { NUMBERS } from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import generator from "./${statement.id}.ts";

describe("${statement.id}", () => {
  for (const depth of generator.depths) {
    for (const numbers of NUMBERS) {
      it(\`generates depth \${depth} \${numbers} questions deterministically\`, () => {
        for (let seed = 0; seed < 50; seed++) {
          const question = generator.generate({ depth, numbers, seed });
          expect(generator.generate({ depth, numbers, seed })).toEqual(question);
        }
      });
    }
  }
});
`;
}

/** Writes the two files; returns their paths, or throws if the ID is unknown or files exist. */
export function scaffold(id: string, statements: Statement[], dir = GENERATORS_DIR): string[] {
  const statement = statements.find((s) => s.id === id);
  if (!statement) throw new Error(`${id} is not a statement in data/statements.json.`);
  const folder = join(dir, keyStageFolder(statement.stage));
  const files = [
    [join(folder, `${id}.ts`), generatorTemplate(statement)],
    [join(folder, `${id}.test.ts`), testTemplate(statement)],
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

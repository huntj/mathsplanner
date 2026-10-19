// pnpm new <ID>: will scaffold a generator file, a test file and a gallery entry from a
// template. Stub until Phase 1 provides defineGenerator; for now it only checks the ID and
// shows what it would create.
import { keyStageFolder } from "@mathsplanner/core";
import { loadStatements } from "./coverage.ts";

const id = process.argv[2];
if (!id) {
  console.error("Usage: pnpm new <statement ID>, e.g. pnpm new Y5-FR-04");
  process.exit(1);
}

const statement = loadStatements().find((s) => s.id === id);
if (!statement) {
  console.error(`${id} is not a statement in data/statements.json.`);
  process.exit(1);
}

const folder = keyStageFolder(statement.stage);
console.log(`${statement.id}: ${statement.text}`);
console.log("\n`pnpm new` is not implemented yet (it arrives with defineGenerator in Phase 1).");
console.log("It will create:");
console.log(`  packages/generators/src/${folder}/${statement.id}.ts`);
console.log(`  packages/generators/src/${folder}/${statement.id}.test.ts`);
console.log("  a gallery entry for the statement");
process.exitCode = 1;

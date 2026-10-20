// Statements and generators, joined once for the whole gallery.
import {
  createRegistry,
  type Generator,
  type Stage,
  type Statement,
  type StatementsFile,
} from "@mathsplanner/core";
import { examples, generators } from "@mathsplanner/generators";
import statementsFile from "../../../data/statements.json" with { type: "json" };

export const statements = (statementsFile as StatementsFile).statements;
export const statementById = new Map(statements.map((s) => [s.id, s]));

/** Statements that list each statement as a prerequisite. */
export const neededBy = new Map<string, Statement[]>();
for (const s of statements) {
  for (const need of s.needs) neededBy.set(need, [...(neededBy.get(need) ?? []), s]);
}

const registry = createRegistry(generators, statements);
// Examples are placeholders: a real generator for the same statement always wins.
const exampleById = new Map(
  createRegistry(examples, statements)
    .entries()
    .filter((e) => !registry.get(e.statement.id))
    .map((e) => [e.statement.id, e.generator]),
);

export interface GeneratorInfo {
  generator: Generator;
  example: boolean;
}

export function generatorFor(id: string): GeneratorInfo | undefined {
  const real = registry.get(id)?.generator;
  if (real) return { generator: real, example: false };
  const example = exampleById.get(id);
  return example ? { generator: example, example: true } : undefined;
}

export const STAGE_NAMES: Record<Stage, string> = {
  N: "Nursery",
  R: "Reception",
  Y1: "Year 1",
  Y2: "Year 2",
  Y3: "Year 3",
  Y4: "Year 4",
  Y5: "Year 5",
  Y6: "Year 6",
  Y7: "Year 7",
  Y8: "Year 8",
  Y9: "Year 9",
  GF: "GCSE (both tiers)",
  GH: "GCSE Higher",
  AL: "A level Maths",
  FM: "Further Maths",
  CM: "Core Maths",
};

export const DEPTH_NAMES = {
  1: "Fluency",
  2: "Varied fluency",
  3: "Representation",
  4: "Reasoning",
  5: "Problem solving",
} as const;

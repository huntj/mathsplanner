import {
  parseId,
  STAGE_RANK,
  STAGE_SOURCE,
  type MisconceptionsFile,
  type Statement,
  type StatementsFile,
} from "@mathsplanner/core";
import { Ajv2020, type ErrorObject } from "ajv/dist/2020.js";
import { isStatutory } from "./rules.ts";
import type { CountGroup, ExpectedCount } from "./summary.ts";

export interface GroupCount {
  label: string;
  expected: number;
  actual: number;
}

export interface CheckResult {
  /** Anything here fails data:check. */
  errors: string[];
  /** Oddities worth a human look; they never fail the check. */
  warnings: string[];
  counts: GroupCount[];
  total: { expected: number; actual: number } | undefined;
}

export interface CheckInput {
  statements: unknown;
  misconceptions: unknown;
  statementsSchema: object;
  misconceptionsSchema: object;
  expectedCounts: ExpectedCount[];
}

function schemaErrors(
  file: string,
  schema: object,
  data: unknown,
): { ok: boolean; errors: string[] } {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);
  if (validate(data)) return { ok: true, errors: [] };
  const describe = (e: ErrorObject) =>
    `${file}${e.instancePath || "/"} ${e.message ?? "is invalid"}`;
  return { ok: false, errors: (validate.errors ?? []).map(describe) };
}

/** Finds cycles in the prerequisite graph (at least one per tangle), as ID paths. */
export function findCycles(statements: Statement[]): string[][] {
  const needs = new Map(statements.map((s) => [s.id, s.needs]));
  const state = new Map<string, "visiting" | "done">();
  const stack: string[] = [];
  const cycles: string[][] = [];

  const visit = (id: string) => {
    state.set(id, "visiting");
    stack.push(id);
    for (const need of needs.get(id) ?? []) {
      if (need === id || !needs.has(need)) continue; // self-needs are reported separately
      const seen = state.get(need);
      if (seen === "visiting") cycles.push([...stack.slice(stack.indexOf(need)), need]);
      else if (seen === undefined) visit(need);
    }
    stack.pop();
    state.set(id, "done");
  };

  for (const s of statements) if (!state.has(s.id)) visit(s.id);
  return cycles;
}

function inGroup(s: Statement, group: CountGroup): boolean {
  if (!group.stages.includes(s.stage)) return false;
  if (group.strands?.only && !group.strands.only.includes(s.strand)) return false;
  if (group.strands?.except?.includes(s.strand)) return false;
  return true;
}

function checkStatementFields(s: Statement, errors: string[]) {
  const parsed = parseId(s.id);
  if (!parsed) {
    errors.push(`${s.id}: ID does not follow the ID scheme`);
    return;
  }
  if (s.stage !== parsed.stage)
    errors.push(`${s.id}: stage is ${s.stage}, ID says ${parsed.stage}`);
  if (s.strand !== parsed.strand) {
    errors.push(`${s.id}: strand is ${s.strand}, ID says ${parsed.strand}`);
  }
  if (s.tier !== parsed.tier) {
    errors.push(`${s.id}: tier is ${s.tier ?? "unset"}, ID says ${parsed.tier ?? "unset"}`);
  }
  if (s.option !== parsed.option) {
    errors.push(`${s.id}: option is ${s.option ?? "unset"}, ID says ${parsed.option ?? "unset"}`);
  }
  if (s.years && s.stage !== "AL" && s.stage !== "FM" && s.stage !== "CM") {
    errors.push(`${s.id}: only KS5 statements have years`);
  }
  if (s.source !== STAGE_SOURCE[s.stage]) {
    errors.push(`${s.id}: source is "${s.source}", expected "${STAGE_SOURCE[s.stage]}"`);
  }
  // Reception statutory status depends on the ELG marker, which may be edited out of the text.
  if (s.stage !== "R" && s.statutory !== isStatutory(s.stage, s.text)) {
    errors.push(`${s.id}: statutory should be ${!s.statutory} for stage ${s.stage}`);
  }
}

function prerequisiteWarnings(statements: Statement[], byId: Map<string, Statement>): string[] {
  const warnings: string[] = [];
  for (const s of statements) {
    for (const id of s.needs) {
      const need = byId.get(id);
      if (!need) continue;
      if (STAGE_RANK[need.stage] > STAGE_RANK[s.stage]) {
        warnings.push(
          `${s.id} (${s.stage}) needs ${need.id}, which is taught later (${need.stage})`,
        );
      }
      if (s.tier === "F" && need.tier === "H") {
        warnings.push(`${s.id} is tested on both tiers but needs Higher-only ${need.id}`);
      }
      if (s.years && need.years && Math.max(...s.years) < Math.min(...need.years)) {
        warnings.push(
          `${s.id} (Year ${s.years.join(", ")}) needs ${need.id}, recommended for Year ${need.years.join(", ")}`,
        );
      }
    }
    if (s.needs.length === 0 && s.stage !== "N" && s.stage !== "R") {
      warnings.push(`${s.id} has no prerequisites (an entry point outside EYFS)`);
    }
  }

  const byText = new Map<string, string[]>();
  for (const s of statements) {
    const key = s.text.toLowerCase();
    byText.set(key, [...(byText.get(key) ?? []), s.id]);
  }
  for (const ids of byText.values()) {
    if (ids.length > 1) warnings.push(`${ids.join(" and ")} have identical wording`);
  }
  return warnings;
}

export function checkData(input: CheckInput): CheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const statementsSchema = schemaErrors(
    "statements.json",
    input.statementsSchema,
    input.statements,
  );
  const misconceptionsSchema = schemaErrors(
    "misconceptions.json",
    input.misconceptionsSchema,
    input.misconceptions,
  );
  errors.push(...statementsSchema.errors, ...misconceptionsSchema.errors);
  if (!statementsSchema.ok) return { errors, warnings, counts: [], total: undefined };

  const statements = (input.statements as StatementsFile).statements;
  const byId = new Map<string, Statement>();
  for (const s of statements) {
    if (byId.has(s.id)) errors.push(`${s.id}: duplicate ID`);
    else byId.set(s.id, s);
    checkStatementFields(s, errors);
  }

  for (const s of statements) {
    for (const need of s.needs) {
      if (need === s.id) errors.push(`${s.id}: needs itself`);
      else if (!byId.has(need)) errors.push(`${s.id}: needs ${need}, which does not exist`);
    }
  }

  for (const cycle of findCycles(statements)) {
    errors.push(`prerequisite cycle: ${cycle.join(" → ")}`);
  }

  const counts = input.expectedCounts.map(({ group, expected }) => ({
    label: group.label,
    expected,
    actual: statements.filter((s) => inGroup(s, group)).length,
  }));
  for (const c of counts) {
    if (c.actual !== c.expected) {
      errors.push(`${c.label}: ${c.actual} statements, but the map's summary says ${c.expected}`);
    }
  }
  // Sub-groups such as the Further Maths split are not added into the total.
  const topLevel = input.expectedCounts.filter((c) => !c.group.strands);
  const total = {
    expected: topLevel.reduce((sum, c) => sum + c.expected, 0),
    actual: statements.length,
  };
  if (total.actual !== total.expected) {
    errors.push(
      `${total.actual} statements in total, but the map's summary adds up to ${total.expected}`,
    );
  }

  if (misconceptionsSchema.ok) {
    const codes = new Set<string>();
    for (const m of (input.misconceptions as MisconceptionsFile).misconceptions) {
      if (codes.has(m.code)) errors.push(`misconception ${m.code}: duplicate code`);
      codes.add(m.code);
      if (m.remediate !== undefined && !byId.has(m.remediate)) {
        errors.push(`misconception ${m.code}: remediates to ${m.remediate}, which does not exist`);
      }
    }
  }

  warnings.push(...prerequisiteWarnings(statements, byId));
  return { errors, warnings, counts, total };
}

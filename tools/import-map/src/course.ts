// The Learn Maths course: data/course.txt sets out the path pupils follow, a section for each year
// and in each a few units of skills in the order they are learnt. The text file is the source,
// since it is the easiest to read and reorder; `pnpm data:course` checks it, refills each skill's
// wording and writes data/course.json for apps/learn. `pnpm data:course --draft <stage>` drafts a
// new section from the topics and the prerequisite graph, to tidy by hand.
import {
  STAGES,
  type CourseFile,
  type CourseSection,
  type Stage,
  type Statement,
  type Topic,
} from "@mathsplanner/core";

export const COURSE_VERSION = "0.1.0";

/** The fewest and most skills a unit may hold. */
export const UNIT_SIZE = { min: 3, max: 8 } as const;

export interface CourseResult {
  file: CourseFile;
  /** The source file rewritten with current wording. */
  text: string;
  errors: string[];
}

const SECTION = /^===\s+(.+?)\s+\{([A-Za-z0-9]+)\}\s*$/;
const UNIT = /^##\s+(.+?)\s+\{([a-z0-9-]+)\}\s+\[([a-z0-9-]+)\]\s*$/;
const LINE = /^(\S+)/;

/** Skills: the statements a pupil practises, which are sub-statements or statements with none. */
export const skillsOf = (statements: readonly Statement[]): Statement[] => {
  const parents = new Set(statements.flatMap((s) => (s.parent ? [s.parent] : [])));
  return statements.filter((s) => !parents.has(s.id));
};

/** A prerequisite as skills: a statement with sub-statements stands for all of them. */
const needSkills = (statements: readonly Statement[]) => {
  const steps = new Map<string, string[]>();
  for (const s of statements)
    if (s.parent) steps.set(s.parent, [...(steps.get(s.parent) ?? []), s.id]);
  return (id: string): string[] => steps.get(id) ?? [id];
};

/** Parses and checks the course text against the statements and topics. */
export function buildCourse(
  source: string,
  statements: readonly Statement[],
  topics: readonly Topic[],
): CourseResult {
  const errors: string[] = [];
  const byId = new Map(statements.map((s) => [s.id, s]));
  const skills = new Set(skillsOf(statements).map((s) => s.id));
  const topicIds = new Set(topics.map((t) => t.id));
  const header: string[] = [];
  const sections: CourseSection[] = [];
  const unitIds = new Set<string>();
  const placed = new Map<string, string>();

  source.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    const where = `line ${i + 1}`;
    const isHeading = SECTION.test(line) || UNIT.test(line);
    if (sections.length === 0 && (line.startsWith("#") || line === "") && !isHeading) {
      header.push(raw);
      return;
    }
    if (line === "" || (line.startsWith("#") && !line.startsWith("##"))) return;

    const section = SECTION.exec(line);
    if (section) {
      const [, name = "", stage = ""] = section;
      if (!STAGES.includes(stage as Stage)) errors.push(`${where}: ${stage} is not a stage`);
      if (sections.some((s) => s.stage === stage))
        errors.push(`${where}: section {${stage}} appears twice`);
      sections.push({ stage: stage as Stage, name, units: [] });
      return;
    }
    const current = sections.at(-1);
    if (!current) return void errors.push(`${where}: "${line}" comes before any "=== Section"`);

    if (line.startsWith("##")) {
      const unit = UNIT.exec(line);
      if (!unit) return void errors.push(`${where}: a unit is "## Name {unit-id} [topic-id]"`);
      const [, name = "", id = "", topic = ""] = unit;
      if (unitIds.has(id)) errors.push(`${where}: unit {${id}} appears twice`);
      if (!topicIds.has(topic)) errors.push(`${where}: [${topic}] is not a topic`);
      unitIds.add(id);
      current.units.push({ id, name, topic, skills: [] });
      return;
    }
    const unit = current.units.at(-1);
    const [, id = ""] = LINE.exec(line) ?? [];
    if (!unit) return void errors.push(`${where}: ${id} comes before any "## Unit"`);
    const statement = byId.get(id);
    if (!statement) return void errors.push(`${where}: ${id} is not in statements.json`);
    if (!skills.has(id))
      return void errors.push(`${where}: ${id} has sub-statements; list those instead`);
    if (statement.stage !== current.stage)
      errors.push(`${where}: ${id} is not in ${current.stage}`);
    const other = placed.get(id);
    if (other) return void errors.push(`${where}: ${id} is already in unit ${other}`);
    placed.set(id, unit.id);
    unit.skills.push(id);
  });

  const asSkills = needSkills(statements);
  for (const section of sections) {
    for (const s of skillsOf(statements))
      if (s.stage === section.stage && !placed.has(s.id))
        errors.push(`${s.id} is missing from section ${section.stage}`);
    for (const unit of section.units) {
      const n = unit.skills.length;
      if (n < UNIT_SIZE.min || n > UNIT_SIZE.max)
        errors.push(
          `unit ${unit.id} has ${n} skills; a unit has ${UNIT_SIZE.min} to ${UNIT_SIZE.max}`,
        );
    }
    // A prerequisite in the same section must come earlier on the path.
    const order = section.units.flatMap((u) => u.skills);
    const position = new Map(order.map((id, i) => [id, i]));
    order.forEach((id, i) => {
      for (const need of byId.get(id)?.needs ?? [])
        for (const skill of asSkills(need)) {
          const at = position.get(skill);
          if (at !== undefined && at > i)
            errors.push(`${id} needs ${skill}, which comes later in ${section.stage}`);
        }
    });
  }

  const wording = (id: string) => byId.get(id)?.text ?? "";
  const body = sections.map((s) =>
    [
      `=== ${s.name} {${s.stage}}`,
      ...s.units.map((u) =>
        [
          `## ${u.name} {${u.id}} [${u.topic}]`,
          ...u.skills.map((id) => `${id}  ${wording(id)}`),
        ].join("\n"),
      ),
    ].join("\n\n"),
  );
  const head = header.join("\n").trimEnd();
  return {
    file: { version: COURSE_VERSION, sections },
    text: `${head}\n\n${body.join("\n\n")}\n`,
    errors,
  };
}

/**
 * A first draft of a section: a unit for each topic, ordered so that a topic comes after the
 * topics it needs (by first appearance in the curriculum where they need each other), and split
 * when it holds too many skills. Units that are too small are marked for merging by hand.
 */
export function draftSection(
  stage: Stage,
  name: string,
  statements: readonly Statement[],
  topics: readonly Topic[],
): string {
  const byId = new Map(statements.map((s) => [s.id, s]));
  const order = new Map(statements.map((s, i) => [s.id, i]));
  const main = new Map<string, string>();
  for (const t of topics) for (const id of t.statements) main.set(id, t.id);
  const topicOf = (s: Statement) => main.get(s.id) ?? (s.parent ? main.get(s.parent) : undefined);

  const groups = new Map<string, Statement[]>();
  for (const s of skillsOf(statements).filter((x) => x.stage === stage)) {
    const topic = topicOf(s) ?? "unsorted";
    groups.set(topic, [...(groups.get(topic) ?? []), s]);
  }

  // Topic A comes before B when a skill in B needs one in A; cycles fall back to curriculum order.
  const asSkills = needSkills(statements);
  const groupOf = new Map([...groups].flatMap(([t, xs]) => xs.map((s) => [s.id, t] as const)));
  const after = new Map([...groups.keys()].map((t) => [t, new Set<string>()]));
  for (const [topic, xs] of groups)
    for (const s of xs)
      for (const need of s.needs)
        for (const skill of asSkills(need)) {
          const other = groupOf.get(skill);
          if (other && other !== topic) after.get(topic)?.add(other);
        }
  const first = (t: string) => Math.min(...(groups.get(t) ?? []).map((s) => order.get(s.id) ?? 0));
  const remaining = [...groups.keys()].sort((a, b) => first(a) - first(b));
  const sorted: string[] = [];
  while (remaining.length > 0) {
    const ready = remaining.find((t) => [...(after.get(t) ?? [])].every((d) => sorted.includes(d)));
    const next = ready ?? remaining[0] ?? "";
    sorted.push(next);
    remaining.splice(remaining.indexOf(next), 1);
  }

  // Lay the skills out topic by topic, then move any skill that comes before one it needs to just
  // after it. Where topics need each other, this splits a topic into two runs.
  const path = sorted.flatMap((topic) => (groups.get(topic) ?? []).map((s) => ({ topic, s })));
  const position = () => new Map(path.map((x, i) => [x.s.id, i]));
  for (let moved = true; moved;) {
    moved = false;
    const at = position();
    for (const [i, x] of path.entries()) {
      const last = Math.max(-1, ...x.s.needs.flatMap(asSkills).map((n) => at.get(n) ?? -1));
      if (last > i) {
        path.splice(i, 1);
        path.splice(last, 0, x);
        moved = true;
        break;
      }
    }
  }

  // Each run of one topic becomes units of at most UNIT_SIZE.max skills.
  const runs: { topic: string; skills: Statement[] }[] = [];
  for (const { topic, s } of path) {
    const run = runs.at(-1);
    if (run?.topic === topic) run.skills.push(s);
    else runs.push({ topic, skills: [s] });
  }
  const chunks = runs.flatMap(({ topic, skills }) => {
    const parts = Math.ceil(skills.length / UNIT_SIZE.max);
    const size = Math.ceil(skills.length / parts);
    return Array.from({ length: parts }, (_, p) => ({
      topic,
      skills: skills.slice(p * size, (p + 1) * size),
    }));
  });
  const topicName = new Map(topics.map((t) => [t.id, t.name]));
  const prefix = stage.toLowerCase();
  const total = new Map<string, number>();
  for (const c of chunks) total.set(c.topic, (total.get(c.topic) ?? 0) + 1);
  const seen = new Map<string, number>();
  const units = chunks.map(({ topic, skills }) => {
    const n = (seen.get(topic) ?? 0) + 1;
    seen.set(topic, n);
    const many = (total.get(topic) ?? 1) > 1;
    return [
      `## ${topicName.get(topic) ?? topic}${many ? ` ${n}` : ""} {${prefix}-${topic}${many ? `-${n}` : ""}} [${topic}]`,
      ...(skills.length < UNIT_SIZE.min
        ? ["# Too few skills: merge with a neighbouring unit."]
        : []),
      ...skills.map((s) => `${s.id}  ${byId.get(s.id)?.text ?? ""}`),
    ].join("\n");
  });
  return [`=== ${name} {${stage}}`, ...units].join("\n\n") + "\n";
}

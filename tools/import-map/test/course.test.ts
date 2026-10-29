import type { Statement, StatementsFile, Topic, TopicsFile } from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import { buildCourse, draftSection, skillsOf } from "../src/course.ts";
import { PATHS, readJson, readText } from "../src/files.ts";

const s = (id: string, needs: string[] = [], parent?: string): Statement =>
  ({
    id,
    stage: id.split("-")[0],
    strand: "MD",
    text: `Wording of ${id}`,
    needs,
    source: "NC KS2",
    statutory: true,
    ...(parent ? { parent } : {}),
  }) as Statement;

const STATEMENTS = [
  s("Y5-MD-01"),
  s("Y5-MD-01.a", [], "Y5-MD-01"),
  s("Y5-MD-01.b", ["Y5-MD-01.a"], "Y5-MD-01"),
  s("Y5-MD-02", ["Y5-MD-01"]),
  s("Y5-MD-03"),
  s("Y6-MD-01"),
];
const TOPICS: Topic[] = [
  { id: "factors", name: "Factors", statements: ["Y5-MD-01", "Y5-MD-02"], also: [] },
  { id: "primes", name: "Primes", statements: ["Y5-MD-03", "Y6-MD-01"], also: [] },
];

describe("course", () => {
  it("builds the repository's course and matches course.json", () => {
    const { statements } = readJson(PATHS.statements) as StatementsFile;
    const { topics } = readJson(PATHS.topics) as TopicsFile;
    const source = readText(PATHS.courseText);
    const result = buildCourse(source, statements, topics);
    expect(result.errors).toEqual([]);
    expect(result.text, "run pnpm data:course").toBe(source.replace(/\r\n/g, "\n"));
    expect(readJson(PATHS.course), "run pnpm data:course").toEqual(result.file);
  });

  it("reads sections and units and refills the wording", () => {
    const result = buildCourse(
      "# Header\n\n=== Year 5 {Y5}\n\n## Times {y5-times} [factors]\nY5-MD-01.a old words\nY5-MD-01.b\nY5-MD-02\nY5-MD-03\n",
      STATEMENTS,
      TOPICS,
    );
    expect(result.errors).toEqual([]);
    expect(result.file.sections).toEqual([
      {
        stage: "Y5",
        name: "Year 5",
        units: [
          {
            id: "y5-times",
            name: "Times",
            topic: "factors",
            skills: ["Y5-MD-01.a", "Y5-MD-01.b", "Y5-MD-02", "Y5-MD-03"],
          },
        ],
      },
    ]);
    expect(result.text).toBe(
      "# Header\n\n=== Year 5 {Y5}\n\n## Times {y5-times} [factors]\nY5-MD-01.a  Wording of Y5-MD-01.a\nY5-MD-01.b  Wording of Y5-MD-01.b\nY5-MD-02  Wording of Y5-MD-02\nY5-MD-03  Wording of Y5-MD-03\n",
    );
  });

  it("reports unknown, misplaced, missing and repeated skills, units and topics", () => {
    const { errors } = buildCourse(
      "=== Year 5 {Y5}\n## A {a} [nope]\nY5-MD-01\nNOPE-1\nY6-MD-01\nY5-MD-03\n## B {a} [factors]\nY5-MD-03\n## Bad unit\n=== Again {Y5}\n",
      STATEMENTS,
      TOPICS,
    );
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("[nope] is not a topic"),
        expect.stringContaining("Y5-MD-01 has sub-statements; list those instead"),
        expect.stringContaining("NOPE-1 is not in statements.json"),
        expect.stringContaining("Y6-MD-01 is not in Y5"),
        expect.stringContaining("unit {a} appears twice"),
        expect.stringContaining("Y5-MD-03 is already in unit a"),
        expect.stringContaining('a unit is "## Name {unit-id} [topic-id]"'),
        expect.stringContaining("section {Y5} appears twice"),
        "Y5-MD-01.a is missing from section Y5",
        "unit a has 2 skills; a unit has 3 to 8",
      ]),
    );
  });

  it("needs every prerequisite in the section to come first, a parent standing for its steps", () => {
    const { errors } = buildCourse(
      "=== Year 5 {Y5}\n## A {a} [factors]\nY5-MD-02\nY5-MD-01.b\nY5-MD-01.a\nY5-MD-03\n",
      STATEMENTS,
      TOPICS,
    );
    expect(errors).toEqual([
      "Y5-MD-02 needs Y5-MD-01.a, which comes later in Y5",
      "Y5-MD-02 needs Y5-MD-01.b, which comes later in Y5",
      "Y5-MD-01.b needs Y5-MD-01.a, which comes later in Y5",
    ]);
  });

  it("drafts a section with every skill once, in prerequisite order", () => {
    const { statements } = readJson(PATHS.statements) as StatementsFile;
    const { topics } = readJson(PATHS.topics) as TopicsFile;
    for (const stage of [
      "Y1",
      "Y2",
      "Y3",
      "Y4",
      "Y5",
      "Y6",
      "Y7",
      "Y8",
      "Y9",
      "GF",
      "GH",
    ] as const) {
      const draft = draftSection(stage, stage, statements, topics);
      const { file, errors } = buildCourse(draft, statements, topics);
      expect(errors.filter((e) => !/^unit .* skills; a unit has/.test(e))).toEqual([]);
      const skills = file.sections.flatMap((x) => x.units.flatMap((u) => u.skills));
      const expected = skillsOf(statements).filter((x) => x.stage === stage);
      expect(skills.sort()).toEqual(expected.map((x) => x.id).sort());
      for (const u of file.sections[0]?.units ?? []) expect(u.skills.length).toBeLessThanOrEqual(8);
    }
  });
});

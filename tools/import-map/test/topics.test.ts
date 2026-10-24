import type { Statement, StatementsFile } from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import { PATHS, readJson, readText } from "../src/files.ts";
import { buildTopics } from "../src/topics.ts";

const s = (id: string, parent?: string): Statement =>
  ({
    id,
    stage: "Y5",
    strand: "MD",
    text: `Wording of ${id}`,
    needs: [],
    source: "NC KS2",
    statutory: true,
    ...(parent ? { parent } : {}),
  }) as Statement;

const STATEMENTS = [s("Y5-MD-01"), s("Y5-MD-01.a", "Y5-MD-01"), s("Y5-MD-02"), s("Y5-MD-03")];

describe("topics", () => {
  it("builds the repository's topics with every statement in one, and matches topics.json", () => {
    const { statements } = readJson(PATHS.statements) as StatementsFile;
    const source = readText(PATHS.topicsText);
    const result = buildTopics(source, statements);
    expect(result.errors).toEqual([]);
    expect(result.text, "run pnpm data:topics").toBe(source.replace(/\r\n/g, "\n"));
    expect(readJson(PATHS.topics), "run pnpm data:topics").toEqual(result.file);
  });

  it("sorts into curriculum order and refills the wording", () => {
    const result = buildTopics(
      "# Header\n\n## Factors {factors}\nY5-MD-02 old words\nY5-MD-01\n+ Y5-MD-03\n## Primes {primes}\nY5-MD-03\n",
      STATEMENTS,
    );
    expect(result.errors).toEqual([]);
    expect(result.file.topics[0]).toEqual({
      id: "factors",
      name: "Factors",
      statements: ["Y5-MD-01", "Y5-MD-02"],
      also: ["Y5-MD-03"],
    });
    expect(result.text).toContain(
      "## Factors {factors}\nY5-MD-01  Wording of Y5-MD-01\nY5-MD-02  Wording of Y5-MD-02\n+ Y5-MD-03",
    );
    expect(result.text.startsWith("# Header\n\n## Factors")).toBe(true);
  });

  it("reports unknown, missing and repeated statements and topics", () => {
    const { errors } = buildTopics(
      "## A {a}\nY5-MD-01\nNOPE-1\n## B {a}\nY5-MD-01\n+ Y5-MD-02\n## C {c}\n+ Y5-MD-02\n",
      STATEMENTS,
    );
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("NOPE-1 is not in statements.json"),
        expect.stringContaining("topic {a} appears twice"),
        expect.stringContaining("Y5-MD-01 already has the main topic a"),
        "Y5-MD-02 has no topic",
        "Y5-MD-03 has no topic",
        "topic c has no statements of its own",
      ]),
    );
  });
});

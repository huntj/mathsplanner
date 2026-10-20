import { NUMBERS } from "@mathsplanner/core";
import { renderQuestion } from "@mathsplanner/render";
import { describe, expect, it } from "vitest";
import { generatorFor, statements } from "./data.ts";
import { formatRoute, LIST, parseRoute, statementRoute, type StatementRoute } from "./route.ts";

describe("routes", () => {
  it("round-trips list and statement routes", () => {
    const list = { ...LIST, query: "angles & turns", stage: "Y5" as const, generatedOnly: true };
    expect(parseRoute(formatRoute(list))).toEqual(list);
    expect(parseRoute(formatRoute(LIST))).toEqual(LIST);
    expect(parseRoute(formatRoute({ page: "diagrams" }))).toEqual({ page: "diagrams" });

    const route: StatementRoute = {
      ...statementRoute("AL-P7.4"),
      depth: 4,
      numbers: "stretch",
      seed: 123456,
      version: "1.2.0",
      showAnswers: true,
      showSolution: true,
    };
    expect(parseRoute(formatRoute(route))).toEqual(route);
  });

  it("ignores bad values instead of failing", () => {
    expect(parseRoute("#/s/Y5-GEO-04?depth=9&numbers=huge&seed=-3")).toEqual(
      statementRoute("Y5-GEO-04"),
    );
    expect(parseRoute("#/?stage=Y10")).toEqual(LIST);
    expect(parseRoute("")).toEqual(LIST);
  });
});

describe("links regenerate questions exactly (the Phase 2 exit check)", () => {
  const info = generatorFor("Y5-GEO-04");

  it("uses the real generator, which replaced the Phase 1 placeholder", () => {
    expect(info?.example).toBe(false);
  });

  it("renders the same HTML from a link as from the original key", () => {
    const generator = info?.generator;
    if (!generator) throw new Error("no generator");
    for (const depth of generator.depths) {
      for (const numbers of NUMBERS) {
        for (let seed = 0; seed < 25; seed++) {
          const original = renderQuestion(generator.generate({ depth, numbers, seed }), {
            showAnswers: true,
            showSolution: true,
          });
          const link = formatRoute({
            ...statementRoute(generator.id),
            depth,
            numbers,
            seed,
            version: generator.version,
            showAnswers: true,
            showSolution: true,
          });
          const route = parseRoute(link);
          if (route.page !== "statement" || route.depth === undefined || route.seed === undefined) {
            throw new Error(`bad link ${link}`);
          }
          const again = renderQuestion(
            generator.generate({
              depth: route.depth,
              numbers: route.numbers,
              seed: route.seed,
              ...(route.version ? { version: route.version } : {}),
            }),
            { showAnswers: route.showAnswers, showSolution: route.showSolution },
          );
          expect(again).toBe(original);
        }
      }
    }
  });

  it("loads every statement", () => {
    expect(statements).toHaveLength(686);
  });
});
